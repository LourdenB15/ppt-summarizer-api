import { z } from "zod";

const presentationId = z.string().min(1, "Presentation ID is required");

// POST /v1/upload
export const uploadPresentationSchema = z.object({
  body: z.object({
    summaryDetail: z
      .enum(["short", "medium", "long"], {
        message: "summaryDetail must be 'short', 'medium', or 'long'",
      })
      .default("medium"),
  }),
});

// Shared ID schema
const paramsSchema = z.object({
  id: presentationId,
});

// GET /v1/:id
// GET /v1/:id/status
// DELETE /v1/:id
export const presentationByIdSchema = z.object({
  params: paramsSchema,
});

// GET /v1/:id/download
export const downloadPresentationSchema = z.object({
  params: paramsSchema,
  query: z.object({
    format: z.enum(["pdf", "docx"], {
      message: "Format must be 'pdf' or 'docx'",
    }),
  }),
});

export type UploadPresentationInput =
  z.infer<typeof uploadPresentationSchema>;

export type PresentationByIdInput =
  z.infer<typeof presentationByIdSchema>;

export type DownloadPresentationInput =
  z.infer<typeof downloadPresentationSchema>;