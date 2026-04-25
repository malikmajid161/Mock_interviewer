import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Default models
const GEMINI_MODEL = import.meta.env.VITE_MODEL_NAME || 'gemini-flash-latest';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama3-70b-8192';

const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

// Fallback to Groq if Gemini fails
const generateWithGroq = async (prompt) => {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Generic text generation with fallback
export const generateInterviewContent = async (prompt) => {
  try {
    // Try Gemini first
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (geminiError) {
    console.warn("Gemini failed, trying Groq fallback...", geminiError);
    try {
      return await generateWithGroq(prompt);
    } catch (groqError) {
      console.error("All AI providers failed:", { geminiError, groqError });
      throw new Error("AI service is currently unavailable. Please check your API keys.");
    }
  }
};

// Parse JSON safely from AI response (handles markdown code fences)
export const parseJsonFromAI = (text) => {
  // Remove possible markdown code blocks
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Try to extract just the JSON array or object
  const start = cleaned.indexOf('[') !== -1 ? cleaned.indexOf('[') : cleaned.indexOf('{');
  const end = cleaned.lastIndexOf(']') !== -1 ? cleaned.lastIndexOf(']') + 1 : cleaned.lastIndexOf('}') + 1;
  
  if (start === -1 || end === -1) {
    throw new Error("Could not find valid JSON in AI response");
  }

  const jsonSlice = cleaned.slice(start, end);
  return JSON.parse(jsonSlice);
};

// Generate interview questions for a role
export const generateQuestions = async (role, level) => {
  const prompt = `You are an expert technical interviewer. Generate exactly 10 interview questions for a ${level}-level ${role}.

Return ONLY a valid JSON array, no explanation, no markdown. Format:
[
  {
    "question": "Describe a time you led a project under pressure.",
    "category": "Behavioral",
    "difficulty": "Medium",
    "tips": "Use the STAR method."
  }
]

Categories must be one of: Behavioral, Technical, System Design, HR, Product
Difficulty must be one of: Easy, Medium, Hard`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// Generate MCQ questions for a role
export const generateMCQs = async (role, level) => {
  const prompt = `You are a technical interviewer. Generate exactly 10 multiple choice questions for a ${level}-level ${role}.

Return ONLY a valid JSON array, no explanation, no markdown. Format:
[
  {
    "question": "What does REST stand for?",
    "options": ["Representational State Transfer", "Remote Server Technology", "Real-time Exchange System", "Recursive State Tree"],
    "correctIndex": 0,
    "explanation": "REST stands for Representational State Transfer, an architectural style for distributed systems."
  }
]

Make sure correctIndex is 0, 1, 2, or 3 corresponding to the correct option.`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};
