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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dialogType: "create" | "update"
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

export function TaskDialog({
  open,
  onOpenChange,
  dialogType,
}: TaskDialogProps) {
  const content = contentMap[dialogType]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" />
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </Field>
          </FieldGroup>

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
