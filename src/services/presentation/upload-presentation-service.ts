import { PresentationRepository } from "@/repositories/presentation.repository";
import { parsePptx } from "@/services/ppt/ppt-parser-service";
import { summarizePptText } from "@/services/ppt/ppt-summarizer-service";
import { PresentationStatus } from "@/generated/prisma/client";

type SummaryDetail = "short" | "medium" | "deep_dive";

export async function UploadPresentationService(
  userId: string,
  fileName: string,
  fileBuffer: Buffer,
  summaryDetail: SummaryDetail,
) {
  const presentationRepository = new PresentationRepository();

  try {
    const presentation = await presentationRepository.create({
      userId,
      fileName,
      slides: {},
    });

    await presentationRepository.updateStatus(
      presentation.id,
      PresentationStatus.PROCESSING,
    );

    // Extract text from the pptx file
    const extractedText = await parsePptx(fileBuffer);

    // Generate AI summary
    const summary = await summarizePptText(extractedText, summaryDetail);

    const updated = await presentationRepository.updateStatus(
      presentation.id,
      PresentationStatus.DONE,
      summary,
    );

    return {
      code: 200,
      status: "success",
      message: "Presentation uploaded and summarized successfully",
      data: { presentation: updated },
    };
  } catch (error) {
    console.error("UploadPresentationService error", error);
    return {
      code: 500,
      status: "error",
      message: "Failed to process presentation",
    };
  }
}
