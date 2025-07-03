const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/get-recipe', async (req, res) => {
  const { ingredients, dietary } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{
        role: "user",
        content: `Give me a recipe using these ingredients: ${ingredients}. It should be suitable for: ${dietary}. Respond with ingredients, steps, and title.`,
      }],
    });

    res.json({ recipe: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch recipe.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
