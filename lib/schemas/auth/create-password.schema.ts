import { z } from "zod";

export const createPasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required." }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;
