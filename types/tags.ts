import { z } from "zod"

export const getTagResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
})

export type TGetTagResponse = z.infer<typeof getTagResponseSchema>

export const tagFormSchema = getTagResponseSchema.omit({
  id: true,
})

export type TagFormValues = z.infer<typeof tagFormSchema>
