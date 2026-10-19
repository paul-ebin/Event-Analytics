
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().max(255),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().max(255),
  password: z.string().min(8).max(72),
});

export type LoginInput = z.infer<typeof loginSchema>;
