"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UPDATE_TASK_FORM_METADATA } from "@/constants/task-form-meta"
import useTaskUpdate from "@/hooks/use-task-update"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import {
  TGetTaskDetailResponseSchemaDto,
  updateTaskFormSchema,
  UpdateTaskFormValues,
} from "@/types/task"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"

type UpdateTaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId?: string
}

export function UpdateTaskDialog({
  open,
  onOpenChange,
  taskId,
}: UpdateTaskDialogProps) {
  const queryClient = useQueryClient()
  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      expiredAt: new Date().toISOString(),
      status: "PENDING",
    },
  })
  useQuery<ApiResponse<TGetTaskDetailResponseSchemaDto>>({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto>({
        url: `/tasks/${taskId}`,
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }
      const task = response.data

      form.reset({
        title: task.title ?? "",
        description: task.description ?? "",
        expiredAt: task.expiredAt ?? new Date().toISOString(),
        status: task.status ?? "PENDING",
      })

      return response
    },
    enabled: open && !!taskId,
  })

  const { isPending, mutate } = useTaskUpdate(taskId!)

  function onSubmit(data: UpdateTaskFormValues) {
    mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["tasks"] })
        await queryClient.invalidateQueries({ queryKey: ["tasks", taskId] })
        onOpenChange(false)
        toast.success("Task updated successfully")
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error))
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>Update your task information.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <FieldGroup>
              {UPDATE_TASK_FORM_METADATA.map((item) => (
                <FormItem key={item.name} {...item} />
              ))}
            </FieldGroup>
          </FormProvider>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
