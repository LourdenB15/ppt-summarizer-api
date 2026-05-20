import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/config/env";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || "");

const CHAT_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
];

export async function generateChatResponse(prompt: string): Promise<string> {
  let lastError: any;

  for (const modelName of CHAT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `x`,
      });

      const chat = model.startChat({});

      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed, falling back...`, error);
      lastError = error;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || "Unknown error"}`,
  );
}
