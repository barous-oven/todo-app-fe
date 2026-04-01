import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { DATETIME_FORMAT } from "@/constants/datetime-format"
import useTaskUpdate from "@/hooks/use-task-update"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TGetTaskResponseSchemaDto } from "@/types/task"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { toast } from "sonner"
import CustomAlertDialog from "../custom/custom-alert-dialog"
import { FieldLabel } from "../ui/field"
import { TASK_STATUS_MAP } from "@/constants/task-constant"

type TaskItemProps = TGetTaskResponseSchemaDto & {
  onEdit: () => void
}

export function TaskItem({
  id,
  title,
  status,
  tagIds,
  tags,
  expiredAt,
  onEdit,
}: TaskItemProps) {
  const queryClient = useQueryClient()
  const updateMutation = useTaskUpdate(id)

  const isCompleted = status === "COMPLETED"
  const isOverdue = new Date(expiredAt) < new Date() && !isCompleted

  const toggleComplete = async () => {
    try {
      status = !isCompleted ? "COMPLETED" : "PENDING"

      const body: Omit<TGetTaskResponseSchemaDto, "id" | "tags"> = {
        title,
        status,
        tagIds,
        expiredAt,
      }

      updateMutation.mutate(body, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (error) => {
          toast.error(handleErrorMessage(error))
        },
      })
    } catch (error) {
      toast.error(handleErrorMessage(error))
    }
  }

  const deleteMutation = useMutation({
    mutationKey: ["tasks"],
    mutationFn: async (taskId: string) => {
      fetchData({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      })
    },
  })
  const onDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
        toast.success("Delete successfully!")
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error))
      },
    })
  }

  return (
    <Item
      variant="outline"
      className="group w-full cursor-pointer bg-white py-3"
    >
      <ItemContent className="flex flex-col gap-2" onClick={onEdit}>
        <div className="flex items-center gap-3">
          <Checkbox
            id={id}
            checked={isCompleted}
            onCheckedChange={toggleComplete}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mark "${title}" as complete`}
            className="cursor-pointer transition-colors hover:border-primary hover:bg-primary/10 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />

          <FieldLabel className="w-full cursor-pointer" id={id}>
            <ItemTitle
              className={`transition-all duration-300 ${
                isCompleted
                  ? "text-muted-foreground line-through opacity-60"
                  : ""
              }`}
            >
              {title}
            </ItemTitle>
          </FieldLabel>
        </div>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-8">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {tag.title}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pl-8 text-xs text-muted-foreground">
          <Badge
            variant={isCompleted ? "secondary" : "outline"}
            className="capitalize"
          >
            {TASK_STATUS_MAP[status] || ""}
          </Badge>

          <span>•</span>

          <span className={isOverdue ? "font-medium text-destructive" : ""}>
            {isOverdue ? "Expired: " : "Expires at: "}
            {format(expiredAt, DATETIME_FORMAT)}
          </span>
        </div>
      </ItemContent>

      <ItemActions>
        <CustomAlertDialog
          title="Delete task?"
          description="This action cannot be undone. This task will be permanently deleted."
          onAccept={onDelete}
          acceptTitle="Delete"
        />
      </ItemActions>
    </Item>
  )
}
