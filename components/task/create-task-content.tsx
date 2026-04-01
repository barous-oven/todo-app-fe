"use client"

import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useTaskMetadata } from "@/hooks/use-task-meta"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import {
  createTaskFormSchema,
  CreateTaskFormValues,
  TGetTaskDetailResponseSchemaDto,
} from "@/types/task"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"

type CreateTaskContentProps = {
  onOpenChange: (open: boolean) => void
}

export function CreateTaskContent({ onOpenChange }: CreateTaskContentProps) {
  const metadata = useTaskMetadata("create")
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
    <div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormProvider {...form}>
          <FieldGroup>
            {metadata.map((item) => (
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
    </div>
  )
}
