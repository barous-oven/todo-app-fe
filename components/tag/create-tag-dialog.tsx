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

import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"
import { TGetTagResponse, TagFormValues, tagFormSchema } from "@/types/tags"
import { TAG_FORM_METADATA } from "@/constants/tag-form-meta"

type CreateTagDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTagDialog({ open, onOpenChange }: CreateTagDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ["tags", "create"],
    mutationFn: async (body: TagFormValues) => {
      const response = await fetchData<TGetTagResponse>({
        url: "/tags",
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
      await queryClient.invalidateQueries({ queryKey: ["tags"] })
      form.reset({
        title: "",
        description: "",
      })
      onOpenChange(false)
      toast.success("Tag created successfully")
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error))
    },
  })

  function onSubmit(data: TagFormValues) {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new tag.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <FieldGroup>
              {TAG_FORM_METADATA.map((item) => (
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
