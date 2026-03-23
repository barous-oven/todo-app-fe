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
import { TGetTaskDetailResponseSchemaDto } from "@/types/task"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-time-picker"

const TASK_STATUS_LABEL = [
  { label: "PENDING", value: "PENDING" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
]

type TaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dialogType: "create" | "update"
  task_id?: string
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

export function TaskDialog({
  open,
  onOpenChange,
  dialogType,
  task_id,
}: TaskDialogProps) {
  const content = contentMap[dialogType]
  const isUpdate = dialogType === "update"

  const task = tasks.find((t) => t.id === task_id) ?? null

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
              <Input
                id="title"
                name="title"
                placeholder="Title"
                defaultValue={task ? task.title : ""}
              />
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description"
                defaultValue={task ? task.description : ""}
              />
            </Field>

            {isUpdate && (
              <Field>
                <Label htmlFor="status">Status</Label>

                <Select defaultValue={task ? task.status : ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {TASK_STATUS_LABEL.map((item) => (
                        <SelectItem key={item.label} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field>
              <Label htmlFor="expired_at">Expires at</Label>
              <DateTimePicker
                defaultValue={task ? new Date(task.expiredAt) : new Date()}
              />
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
