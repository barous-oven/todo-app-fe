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
import { TAG_FORM_METADATA } from "@/constants/tag-form-meta"
import useTagUpdate from "@/hooks/use-tag-update"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TagFormValues, TGetTagResponse, tagFormSchema } from "@/types/tags"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormItem } from "../form/form-item"
import { Button } from "../ui/button"
import { FieldGroup } from "../ui/field"

type UpdateTagDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tagId?: string
}

export function UpdateTagDialog({
  open,
  onOpenChange,
  tagId,
}: UpdateTagDialogProps) {
  const queryClient = useQueryClient()
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
  useQuery<ApiResponse<TGetTagResponse>>({
    queryKey: ["tags", tagId],
    queryFn: async () => {
      const response = await fetchData<TGetTagResponse>({
        url: `/tags/${tagId}`,
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }
      const tag = response.data

      form.reset({
        title: tag.title ?? "",
        description: tag.description ?? "",
        
      })

      return response
    },
    enabled: open && !!tagId,
  })

  const { isPending, mutate } = useTagUpdate(tagId!)

  function onSubmit(data: TagFormValues) {
    mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["tags"] })
        await queryClient.invalidateQueries({ queryKey: ["tags", tagId] })
        onOpenChange(false)
        toast.success("Tag updated successfully")
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
            <DialogTitle>Update Tag</DialogTitle>
            <DialogDescription>Update your tag information.</DialogDescription>
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
              {isPending ? "Submitting..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
