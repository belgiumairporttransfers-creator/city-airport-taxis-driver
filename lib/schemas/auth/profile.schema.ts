import { z } from "zod";

export const profileSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(["driver", "user"]),
  isVerified: z.boolean().optional(),
  status: z.enum(["active", "suspended"]).optional(),
});

export type Profile = z.infer<typeof profileSchema>;
