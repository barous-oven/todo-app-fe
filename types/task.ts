import { z } from "zod"

enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export const taskStatusMap = {
  PENDING: "pending",
  IN_PROGRESS: "in_progess",
  COMPLETED: "completed",
}

export const getTaskResponseSchema = z.object({
  id: z.string().uuid(),

  title: z.string().min(1, "Title must not be empty"),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

  expiredAt: z.string().date(),
})

export type TGetTaskResponseSchemaDto = z.infer<typeof getTaskResponseSchema>
