
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SyllabusTopic, TeachingSession } from "../types";

// Initialize AI with the provided API Key from environment
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseSyllabus = async (fileData: string, mimeType: string): Promise<SyllabusTopic[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const prompt = "Extract a structured list of learning topics from this syllabus or study material. For each topic, provide a short title and a one-sentence brief. Ensure the output is a clean JSON array.";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: fileData.split(',')[1], mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["id", "title", "description"]
        }
      }
    }
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson || '[]');
  return parsed.map((item: any) => ({ ...item, completed: false }));
};

export const teachTopic = async (topicTitle: string, syllabusContext: string): Promise<TeachingSession> => {
  const ai = getAI();
  // Using Flash model for sub-3-second response times as requested
  const model = 'gemini-3-flash-preview';

  const prompt = `Act as the world's best personal tutor. Your mission is to teach "${topicTitle}" so simply that a 10-year-old could understand it, but so powerfully that an adult will never forget it.
  Context from syllabus: ${syllabusContext}.
  
  Please provide:
  1. "Explanation": A narrative-driven explanation (Story Version/ELI5). Use a brilliant story or metaphor that makes the topic impossible to forget.
  2. "Analogies": Two vivid, relatable analogies from daily life.
  3. "KeyConcepts": Five essential points written as catchy, short rules.
  4. "Examples": Two concrete real-world use cases.
  5. "Quiz": A 3-question mastery check.

  Tone: Warm, enthusiastic, and extremely clear. Avoid all academic jargon. Keep text punchy for fast generation. Respond strictly in JSON format matching the required schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // Disabling thinking budget to minimize latency and hit the 2-3s target
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          analogies: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                detail: { type: Type.STRING }
              },
              required: ["title", "detail"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["topic", "explanation", "analogies", "keyConcepts", "examples", "quiz"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
