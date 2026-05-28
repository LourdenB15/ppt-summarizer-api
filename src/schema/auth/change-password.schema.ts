import { z } from "zod";

const passwordRules = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ message: "Current password is required" }),
    newPassword: passwordRules,
  }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
