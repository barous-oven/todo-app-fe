import { z } from "zod"

enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export const getTaskResponseSchema = z.object({
  id: z.string().uuid(),

  title: z.string().min(1, "Title must not be empty"),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

  expiredAt: z.string().date(),
})

export type TGetTaskResponseSchemaDto = z.infer<typeof getTaskResponseSchema>
