import { describe } from "node:test"
import { z } from "zod"

export const TASK_STATUS_LABEL = [
  { label: "PENDING", value: "PENDING" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
]

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

export const getTaskDetailResponseSchema = z.object({
  id: z.string().uuid(),

  title: z.string().min(1, "Title must not be empty"),

  description: z.string().optional(),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

  expiredAt: z.string().date(),
})

export type TGetTaskDetailResponseSchemaDto = z.infer<
  typeof getTaskDetailResponseSchema
>
