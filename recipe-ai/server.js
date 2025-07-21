import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { OpenAI } from "openai";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 5000;

// Since backend and frontend are on same origin, you can skip CORS or limit it to localhost:5000
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,
}));

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,       // false for localhost (no HTTPS)
      httpOnly: true,
      sameSite: 'lax'
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ====== DATABASE ======
const db = await open({
  filename: "./db.sqlite",
  driver: sqlite3.Database,
});
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  );
`);
await db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    recipe_text TEXT,
    image_url TEXT,
    grocery_list TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// ====== OPENAI CLIENT ======
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ====== PASSPORT (GOOGLE LOGIN) ======
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await db.get("SELECT * FROM users WHERE id = ?", id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await db.get("SELECT * FROM users WHERE email = ?", profile.emails[0].value);
      if (!user) {
        const result = await db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          profile.displayName,
          profile.emails[0].value,
          "" // Google accounts won't have a password
        );
        user = await db.get("SELECT * FROM users WHERE id = ?", result.lastID);
      }
      return done(null, user);
    }
  )
);

// ====== AUTH ROUTES ======
// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", name, email, hashed);
    res.json({ status: "success" });
  } catch (err) {
    res.json({ status: "error", message: "Email or username already taken." });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.json({ status: "success", username: user.username });
  } else {
    res.json({ status: "error", message: "Invalid email or password" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ status: "success" });
});

// Get current user
app.get("/get-user", async (req, res) => {
  if (req.session.userId) {
    const user = await db.get("SELECT * FROM users WHERE id = ?", req.session.userId);
    res.json({ username: user.username });
  } else {
    res.json({ username: null });
  }
});

// Google Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Google auth error:", err);
      return next(err);
    }
    if (!user) {
      return res.redirect("/login.html");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      // Fix: Set session userId here to match your session logic
      req.session.userId = user.id;

      // Redirect to frontend index on successful login
      return res.redirect("/index.html");
    });
  })(req, res, next);
});

// ====== RECIPE ENDPOINTS ======
app.post("/get-recipe", async (req, res) => {
  const { ingredients, dietary } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{
        role: "user",
        content: `Give me a recipe using these ingredients: ${ingredients}. It should be suitable for: ${dietary}. Respond with ingredients, steps, and title.`,
      }],
    });

    const recipe = completion.choices[0].message.content;
    const title = recipe.split('\n')[0].replace(/^#+\s*/, '');

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A basic dish of ${title}, professional food photography, high quality`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;

    const missingIngredientsResponse = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{
        role: "user",
        content: `Here is a recipe:\n${recipe}\n\nThe user originally provided these ingredients: ${ingredients}.\nPlease list only the additional ingredients used in the recipe that were NOT in the user's original list. Respond with a clean, comma-separated list.`,
      }],
    });

    const groceryList = missingIngredientsResponse.choices[0].message.content.trim();

    res.json({ recipe, imageUrl, groceryList });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch recipe or grocery list.");
  }
});

// Save Recipe (for logged-in user)
app.post("/save-recipe", async (req, res) => {
  if (!req.session.userId) return res.json({ status: "error", message: "Not logged in" });

  const { recipe, imageUrl, groceryList } = req.body;
  await db.run(
    "INSERT INTO recipes (user_id, recipe_text, image_url, grocery_list) VALUES (?, ?, ?, ?)",
    req.session.userId,
    recipe,
    imageUrl,
    groceryList
  );
  res.json({ status: "success" });
});

// Get Saved Recipes
app.get("/get-saved-recipes", async (req, res) => {
  if (!req.session.userId) return res.json({ status: "error", recipes: [] });

  const recipes = await db.all("SELECT * FROM recipes WHERE user_id = ?", req.session.userId);
  res.json({ status: "success", recipes });
});

// DELETE recipe route (add this in your Express backend file)
app.post("/delete-recipe", async (req, res) => {
  if (!req.session.userId) return res.json({ status: "error", message: "Not logged in" });

  const { id } = req.body;
  if (!id) return res.json({ status: "error", message: "Recipe ID required" });

  try {
    await db.run("DELETE FROM recipes WHERE id = ? AND user_id = ?", id, req.session.userId);
    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "Failed to delete recipe" });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));