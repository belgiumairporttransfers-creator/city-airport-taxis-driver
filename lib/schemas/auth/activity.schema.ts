import { z } from "zod";

export const activitySchema = z.object({
  _id: z.string(),
  type: z.enum([
    "login",
    "logout",
    "password_change",
    "password_reset",
    "password_reset_request",
    "update_profile",
    "logout_all",
    "email_verified",
    "session_revoked",
  ]),
  status: z.enum(["success", "failed"]),
  ipAddress: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  timestamp: z.string(),
});

export type Activity = z.infer<typeof activitySchema>;
