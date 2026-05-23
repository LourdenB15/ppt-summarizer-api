import { generateChatResponse } from "@/services/ai/core/gemini-service";
import { SummaryDetail } from "@/generated/prisma/client";

const prompts: Record<SummaryDetail, string> = {
  SHORT: "Summarize this PowerPoint in 3-5 bullet points only. Be very brief.",
  MEDIUM:
    "Summarize this PowerPoint clearly with key points per topic. Use bullet points.",
  DEEP_DIVE:
    "Give a detailed and comprehensive summary of this PowerPoint. Cover every topic thoroughly with explanations.",
};

export async function summarizePptText(
  rawText: string,
  detail: SummaryDetail,
): Promise<string> {
  const prompt = `${prompts[detail]}${rawText}`;
  return generateChatResponse(prompt);
}
