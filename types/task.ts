import { z } from "zod"
import { getTagResponseSchema } from "./tags"

export type TTaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED"

export const getTaskResponseSchema = z.object({
  id: z.string().uuid(),

  title: z.string().min(1, "Title must not be empty"),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

  tagIds: z.array(z.string().uuid()).optional(),

  tags: z.array(getTagResponseSchema),

  expiredAt: z.coerce.string(),
})

export type TGetTaskResponseSchemaDto = z.infer<typeof getTaskResponseSchema>

export const getTaskDetailResponseSchema = z.object({
  id: z.string().uuid(),

  title: z.string().min(1, "Title must not be empty"),

  description: z.string().optional(),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

  tagIds: z.array(z.string().uuid()).optional(),

  tags: z.array(getTagResponseSchema),

  expiredAt: z.coerce.string(),
})

export type TGetTaskDetailResponseSchemaDto = z.infer<
  typeof getTaskDetailResponseSchema
>

export const createTaskFormSchema = getTaskDetailResponseSchema.omit({
  id: true,
  status: true,
  tags: true,
})

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>

export const updateTaskFormSchema = getTaskDetailResponseSchema.omit({
  id: true,
  tags: true,
})

export type UpdateTaskFormValues = z.infer<typeof updateTaskFormSchema>
