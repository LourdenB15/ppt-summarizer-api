import { generateChatResponse } from "@/services/ai/core/gemini-service";
import { SummaryDetail } from "@/generated/prisma/client";

const FORMAT_RULES = `Output format (strict Markdown):
- Line 1: document title (plain text, no prefix)
- Line 2: blank
- Use ## for section headings
- Use * for bullet points
- No intro text, no closing remarks, no inline headings mixed with content

`;

const prompts: Record<SummaryDetail, string> = {
  SHORT: `${FORMAT_RULES}Summarize in 3-5 bullet points only. Be very brief.\n\n`,
  MEDIUM: `${FORMAT_RULES}Summarize with key points per topic.\n\n`,
  DEEP_DIVE: `${FORMAT_RULES}Give a detailed and comprehensive summary covering every topic thoroughly.\n\n`,
};

export async function summarizePptText(
  rawText: string,
  detail: SummaryDetail,
): Promise<string> {
  const prompt = `${prompts[detail]}${rawText}`;
  return generateChatResponse(prompt);
}
