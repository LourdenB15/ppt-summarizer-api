import { generateChatResponse } from "@/services/ai/core/gemini-service";

export async function summarizePptText(rawText: string): Promise<string> {
  const prompt = `
You are an educational assistant. Below is the extracted text from a PowerPoint presentation.

Your task:
1. Summarize each major topic clearly and simply
2. Use plain language that a student can easily understand
3. Keep bullet points where helpful
4. Do not repeat slide headers as-is — rephrase them into explanations
5. Do not start your response with any intro sentence like "Here's a breakdown..." — go straight into the content

Presentation content:
${rawText}
`;

  return generateChatResponse(prompt);
}
