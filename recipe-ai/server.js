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
        content: `Give me a recipe using these ingredients: ${ingredients}. It should be suitable for: ${dietary}. Respond with ingredients, steps, and title. Also add a blank line inbetween each step`,
      }],
    });

    const recipe = completion.choices[0].message.content;

    // Extract title (assumes first line is title)
    const title = recipe.split('\n')[0].replace(/^#+\s*/, '');

    // Generate image based on the title
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A basic dish of ${title}, keeping to these ingredients if possible: ${ingredients}, professional food photography, high quality`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;

    res.json({ recipe, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch recipe or image.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
