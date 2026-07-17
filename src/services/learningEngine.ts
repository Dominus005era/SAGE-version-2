import { GoogleGenAI, Type } from "@google/genai";
import { Category, KnowledgeItem } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "dummy-gemini-api-key";

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. AI content generation will fail until you configure GEMINI_API_KEY in your .env.local file.");
}

const ai = new GoogleGenAI({ apiKey });


export async function generateMicroContent(category: Category, mode: 'fact' | 'quiz', language: string = 'english'): Promise<KnowledgeItem> {
  const prompt = mode === 'fact' 
    ? `Generate a mind-blowing, 20-30 second micro-fact about ${category}. It should be surprising and highly technical but accessible. 
       THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`
    : `Generate a scenario-based logic challenge for ${category} for someone aged 16-30. 
       The user must make a decision. Provide 3-4 options.
       Include a "Logic Correction" - a detailed explanation of why the correct answer is logically superior and why common pitfalls occur.
       THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING, description: "The fact text or the scenario description" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Only for quiz mode. 3-4 options."
      },
      correctOptionIndex: { type: Type.INTEGER, description: "Only for quiz mode." },
      explanation: { type: Type.STRING, description: "The logic correction/explanation" }
    },
    required: ["title", "content", "explanation"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema as any
    }
  });

  const data = JSON.parse(response.text);
  
  return {
    id: crypto.randomUUID(),
    type: mode,
    category,
    createdAt: new Date().toISOString(),
    ...data
  };
}
