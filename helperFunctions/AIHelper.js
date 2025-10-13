const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // your OpenRouter key
  baseURL: "https://openrouter.ai/api/v1", // tell it to use OpenRouter
});

async function generateBookSummary(title, author) {
  const prompt = `Generate a short, engaging 3–4 sentence summary for the book titled "${title}" by ${author}.`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [
      { role: "system", content: "You are an assistant that writes book summaries." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    extra_headers: {
      "HTTP-Referer": "https://your-site-url.com", // optional (for OpenRouter ranking)
      "X-Title": "KitabKart AI Summary", // optional
    },
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateBookSummary };
