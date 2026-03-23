import { z } from "zod"

export const registerRequestSchema = z
  .object({
    email: z.string({ message: "Email is required" }).email("Email is invalid"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({ message: "Confirm password is required" }),
    name: z.string({ message: "Name is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })

export type TRegisterRequestDto = z.infer<typeof registerRequestSchema>
