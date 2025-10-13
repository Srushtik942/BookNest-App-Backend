const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateBookCover(title, author) {
  const prompt = `Create a visually appealing book cover for a book titled "${title}" by ${author}.
  The design should reflect the theme and mood of the story.`;

  const response = await openai.images.generate({
    model: "openai/gpt-oss-20b:free",
    prompt,
    size: "auto",
  });

  const imageUrl = response.data[0].url;
  return imageUrl;
}

module.exports = { generateBookCover };
