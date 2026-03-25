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
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "../auth-provider"

import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { IFormItemProps } from "@/types/form-item"
import {
  createTaskFormSchema,
  CreateTaskFormValues,
  TGetTaskDetailResponseSchemaDto
} from "@/types/task"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"

type CreateTaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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
    name: "expiredAt",
    label: "Expire At",
    type: "datetime-picker",
  },
]

export function CreateTaskDialog({
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      expiredAt: new Date().toISOString(),
    },
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ["tasks", "create"],
    mutationFn: async (body: CreateTaskFormValues) => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto>({
        url: "/tasks",
        method: "POST",
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
      form.reset({
        title: "",
        description: "",
        expiredAt: new Date().toISOString(),
      })
      onOpenChange(false)
      toast.success("Task created successfully")
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error))
    },
  })

  function onSubmit(data: CreateTaskFormValues) {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new task.
            </DialogDescription>
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
              {isPending ? "Submitting..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
