import { z } from "zod";

export const downloadSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid presentation ID"),
  }),
  query: z.object({
    format: z.enum(["pdf", "docx"], {
      message: "Format must be pdf or docx",
    }),
  }),
});
