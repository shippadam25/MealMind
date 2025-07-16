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

    const recipe = completion.choices[0].message.content;
    const title = recipe.split('\n')[0].replace(/^#+\s*/, '');

    // Generate image based on recipe title
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A basic dish of ${title}, professional food photography, high quality`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;

    // Ask AI to list additional ingredients not mentioned in user's list
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
