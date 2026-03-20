import { z } from "zod"

export const loginRequestSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Email is invalid"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
})

export type TLoginRequestDto = z.infer<typeof loginRequestSchema>
