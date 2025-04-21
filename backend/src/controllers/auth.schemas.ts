import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(6).max(255);


export const loginSchema = z.object({
  // username: z.string().min(3, "Username is required").max(100),
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});
export const registerSchema = loginSchema
  .extend({
    username: z.string().min(1, "Username is required").max(255),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});