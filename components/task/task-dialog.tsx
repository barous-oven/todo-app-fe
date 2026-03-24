"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { TSelectOptions } from "@/types/select-options"
import {
  getTaskDetailResponseSchema,
  TASK_STATUS_LABEL,
  TGetTaskDetailResponseSchemaDto,
} from "@/types/task"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { FormItem } from "../form/form-item"
import { useMemo } from "react"
import { IFormItemProps } from "@/types/form-item"

type TaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId?: string
}

const contentMap = {
  create: {
    title: "Create task",
    description: "Fill in the information below to create a new task.",
    submitText: "Create",
  },
  update: {
    title: "Update task",
    description: "Update your task information.",
    submitText: "Update",
  },
} as const

const tasks: TGetTaskDetailResponseSchemaDto[] = [
  {
    id: "018fc70f-6b70-4367-a9e8-414df3058844",
    title: "Update design system documentation",
    description: "Update design system documentation",
    status: "COMPLETED",
    expiredAt: "2026-03-18T10:13:39.000Z",
  },
  {
    id: "a9258449-4afe-430b-90e6-340722bbb503",
    title: "Implement new task filtering logic",
    description: "Update design system documentation",
    status: "PENDING",
    expiredAt: "2026-03-25T10:13:39.000Z",
  },
  {
    id: "e40793c6-ca24-409e-9c40-63e71e798c08",
    title: "Finalize Q1 presentation slides",
    description: "Update design system documentation",
    status: "PENDING",
    expiredAt: "2026-03-18T10:13:39.000Z",
  },
]

export function TaskDialog({ open, onOpenChange, taskId }: TaskDialogProps) {
  const isUpdate = !!taskId
  const content = contentMap[isUpdate ? "update" : "create"]

  const task = tasks.find((t) => t.id === taskId) ?? null

  const taskFormSchema = getTaskDetailResponseSchema.omit({
    id: true,
  })

  const defaultValues: Omit<TGetTaskDetailResponseSchemaDto, "id"> = {
    title: task ? task.title : "",
    description: task ? task.description : "",
    expiredAt: task ? task.expiredAt : "",
    status: task ? task.status : "PENDING",
  }

  const form = useForm<Omit<TGetTaskDetailResponseSchemaDto, "id">>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    values: defaultValues,
  })

  const fields = useMemo(() => {
    const fieldInfor: IFormItemProps<TGetTaskDetailResponseSchemaDto>[] = [
      {
        name: "title",
        type: "text",
        label: "Title",
        placeholder: "Title",
      },
      {
        name: "description",
        type: "text",
        label: "Description",
        placeholder: "Description",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        selectOptions: TASK_STATUS_LABEL,
      },
      {
        name: "expiredAt",
        label: "Expire At",
        type: "datetime-picker",
      },
    ]
    if (!isUpdate) {
      return fieldInfor.filter((item) => item.name !== "status")
    }
    return fieldInfor
  }, [isUpdate])

  function onSubmit(date: Omit<TGetTaskDetailResponseSchemaDto, "id">) {
    // TODO: integrate api
    console.log("🚀 ~ onSubmit ~ date:", date)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <FieldGroup>
              {fields.map((item) => {
                return <FormItem key={item.name} {...item} />
              })}
            </FieldGroup>
          </FormProvider>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{content.submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
