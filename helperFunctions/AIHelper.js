const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateBookSummary(title, author) {
  const prompt = `Generate a short, engaging 3-4 sentence summary for the book titled "${title}" by ${author}.`;

  const response = await openai.chat.completions.create({
    // model: "gpt-4o-mini",
    model:"gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an assistant that writes book summaries." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateBookSummary };
