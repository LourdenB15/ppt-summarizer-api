import { Request, Response } from "express";
import { UploadPresentationService } from "@/services/presentation/upload-presentation-service";
import { PresentationRepository } from "@/repositories/presentation.repository";
import { generatePdf, generateDocx } from "@/services/presentation/download-presentation-service";

export class PresentationController {
  private presentationRepository = new PresentationRepository();

  public upload = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ code: 400, status: "error", message: "No file uploaded" });
    }

    const result = await UploadPresentationService(
      userId,
      file.originalname,
      file.buffer,
    );
    return res.status(result.code).json(result);
  };

  public getAll = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const presentations =
      await this.presentationRepository.findAllByUser(userId);
    return res
      .status(200)
      .json({ code: 200, status: "success", data: { presentations } });
  };

  public getById = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const id = req.params.id as string;
    const presentation = await this.presentationRepository.findById(id, userId);

    if (!presentation) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presentation not found",
      });
    }

    return res
      .status(200)
      .json({ code: 200, status: "success", data: { presentation } });
  };

  public delete = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const id = req.params.id as string;

    const existing = await this.presentationRepository.findById(id, userId);
    if (!existing) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presentation not found",
      });
    }

    await this.presentationRepository.delete(id, userId);
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Presentation deleted successfully",
    });
  };

  public getStatus = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const id = req.params.id as string;
    const presentation = await this.presentationRepository.findById(id, userId);

    if (!presentation) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presentation not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      data: { status: presentation.status, summary: presentation.summary },
    });
  };

  public download = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const id = req.params.id as string;
    const format = req.query.format as string;

    if (!["pdf", "docx"].includes(format)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Format must be pdf or docx",
      });
    }

    const presentation = await this.presentationRepository.findById(id, userId);
    if (!presentation) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presentation not found",
      });
    }

    if (!presentation.summary) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Summary is not ready yet",
      });
    }

    const baseName = presentation.fileName.replace(".pptx", "");

    if (format === "pdf") {
      const buffer = await generatePdf(presentation.fileName, presentation.summary);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${baseName}.pdf"`);
      return res.send(buffer);
    }

    const buffer = await generateDocx(presentation.fileName, presentation.summary);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${baseName}.docx"`);
    return res.send(buffer);
  };
}
