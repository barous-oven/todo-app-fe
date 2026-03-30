import { fetchData } from "@/lib/fetch-data"
import {
  CreateTaskFormValues,
  TGetTaskDetailResponseSchemaDto,
} from "@/types/task"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldLabel } from "../ui/field"
import { ScrollArea } from "../ui/scroll-area"
import { Textarea } from "../ui/textarea"
import { TaskItemPreview } from "./task-item-preview"
import { toast } from "sonner"
import handleErrorMessage from "../../lib/handle-error-message"

type CreateTaskWithAIDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateTaskWithAIDialog({
  open,
  onOpenChange,
}: CreateTaskWithAIDialogProps) {
  const queryClient = useQueryClient()
  const [requirement, setRequirement] = useState("")
  const [previewTasks, setPreviewTasks] = useState<
    TGetTaskDetailResponseSchemaDto[]
  >([])

  const generateTasksMutation = useMutation({
    mutationFn: async () => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto[]>({
        url: `/tasks/ai-generation`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          requirement,
        },
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      return response.data
    },
    onSuccess: (data) => {
      setPreviewTasks(data)
    },
  })

  const { mutate } = useMutation({
    mutationKey: ["tasks", "create"],
    mutationFn: async (body: CreateTaskFormValues[]) => {
      const response = await fetchData<TGetTaskDetailResponseSchemaDto>({
        url: "/tasks/many",
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
      onOpenChange(false)
      toast.success("Task created successfully")
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error))
    },
  })

  function onGenerate() {
    if (!requirement) return
    generateTasksMutation.mutate()
  }

  function onSubmit() {
    mutate(previewTasks)
    setPreviewTasks([])
  }

  function onDelete(task: TGetTaskDetailResponseSchemaDto) {
    setPreviewTasks(previewTasks.filter((t) => t.title != task.title))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Task With AI</DialogTitle>
          <DialogDescription>
            Let us help you create tasks based on your goal
          </DialogDescription>
        </DialogHeader>

        <FieldLabel htmlFor="requirement">Requirement</FieldLabel>

        <div className="flex items-end gap-2">
          <Textarea
            id="requirement"
            placeholder="Enter your requirement or your goal"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="max-h-24"
          />
          <Button
            type="button"
            disabled={!requirement || generateTasksMutation.isPending}
            onClick={onGenerate}
          >
            {generateTasksMutation.isPending ? "Generating..." : "Generate"}
          </Button>
        </div>

        {previewTasks.length > 0 && (
          <>
            <FieldLabel>Preview tasks</FieldLabel>
            <ScrollArea className="h-75 rounded-md border p-3">
              <div className="flex flex-col gap-2">
                {previewTasks.map((task, index) => (
                  <TaskItemPreview
                    key={index}
                    {...task}
                    status="PENDING"
                    onDelete={() => onDelete(task)}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={onSubmit} disabled={previewTasks.length === 0}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
