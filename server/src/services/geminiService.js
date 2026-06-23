require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateFirstQuestion(role) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a technical interviewer.

The candidate is applying for a ${role} role.

Ask only ONE interview question.
Do not provide answers.
`,
  });

  return response.text.trim();
}

async function evaluateAnswer(question, answer) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer briefly.

Return ONLY a valid JSON object.

{
  "evaluation": "...",
  "nextQuestion": "..."
}

Do not return markdown.
Do not return code blocks.
Do not return any text before or after the JSON.
`,
  });

  // return JSON.parse(response.text);
  const clean = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function generateReport(interviewHistory) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an expert technical interviewer.

Analyze the complete interview history.

Interview History:
${JSON.stringify(interviewHistory)}

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "improvementAreas": [],
  "summary": ""
}

Do not return markdown.
Do not return code blocks.
Do not return any text before or after the JSON.
`,
  });

  // return JSON.parse(response.text);
  const clean = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}


module.exports = {
  generateFirstQuestion, evaluateAnswer, generateReport,
};