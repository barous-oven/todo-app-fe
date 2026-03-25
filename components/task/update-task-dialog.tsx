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
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { IFormItemProps } from "@/types/form-item"
import {
  TASK_STATUS_LABEL,
  TGetTaskDetailResponseSchemaDto,
  updateTaskFormSchema,
  UpdateTaskFormValues
} from "@/types/task"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "../auth-provider"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"

const fieldInfor: IFormItemProps<TGetTaskDetailResponseSchemaDto>[] = [
  {
    name: "title",
    type: "text",
    label: "Title",
    props: {
      placeholder: "Title",
    },
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    props: {
      placeholder: "Description",
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    props: {
      selectOptions: TASK_STATUS_LABEL,
    },
  },
  {
    name: "expiredAt",
    label: "Expire At",
    type: "datetime-picker",
  },
]

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
  const { accessToken } = useAuth()
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

  const { data, isLoading } = useQuery<
    ApiResponse<TGetTaskDetailResponseSchemaDto>
  >({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto>({
        url: `/tasks/${taskId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      return response
    },
    enabled: open && !!accessToken && !!taskId,
  })

  useEffect(() => {
    const task = data?.data
    if (!task) return

    form.reset({
      title: task.title ?? "",
      description: task.description ?? "",
      expiredAt: task.expiredAt ?? new Date().toISOString(),
      status: task.status ?? "PENDING",
    })
  }, [data, form])

  const { isPending, mutate } = useMutation({
    mutationKey: ["tasks", "update", taskId],
    mutationFn: async (body: UpdateTaskFormValues) => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto>({
        url: `/tasks/${taskId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      return response
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] })
      onOpenChange(false)
      toast.success("Task updated successfully")
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error))
    },
  })

  function onSubmit(data: UpdateTaskFormValues) {
    mutate(data)
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
              {fieldInfor.map((item) => (
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
