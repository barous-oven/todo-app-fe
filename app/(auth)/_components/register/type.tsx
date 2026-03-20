import { z } from "zod"

export const RegisterRequestSchema = z
  .object({
    email: z.string({ message: "Email is required" }).email("Email is invalid"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>
