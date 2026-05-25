import { z } from "zod";

export const uploadSchema = z.object({
  body: z.object({
    summaryDetail: z.enum(["SHORT", "MEDIUM", "DEEP_DIVE"], {
      message: "Please select a summary detail level",
    }),
  }),
});
