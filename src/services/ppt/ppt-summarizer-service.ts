import { generateChatResponse } from "@/services/ai/core/gemini-service";

type SummaryDetail = "short" | "medium" | "deep_dive";

const prompts: Record<SummaryDetail, string> = {
  short: "Summarize this PowerPoint in 3-5 bullet points only. Be very brief.",
  medium:
    "Summarize this PowerPoint clearly with key points per topic. Use bullet points.",
  deep_dive:
    "Give a detailed and comprehensive summary of this PowerPoint. Cover every topic thoroughly with explanations.",
};

export async function summarizePptText(
  rawText: string,
  detail: SummaryDetail,
): Promise<string> {
  const prompt = `${prompts[detail]}${rawText}`;
  return generateChatResponse(prompt);
}
