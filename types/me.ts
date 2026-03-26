import { z } from "zod"

export const meResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
})

export type TMeResponseDto = z.infer<typeof meResponseSchema>
