import { format } from "date-fns"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, Clock3, Tag } from "lucide-react"
import { toast } from "sonner"

import { TASK_STATUS_MAP } from "@/constants/task-constant"
import { DATETIME_FORMAT } from "@/constants/datetime-format"
import useTaskUpdate from "@/hooks/use-task-update"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { cn } from "@/lib/utils"
import { TGetTaskResponseSchemaDto } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import CustomAlertDialog from "../custom/custom-alert-dialog"

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
  const isOverdue = !isCompleted && new Date(expiredAt) < new Date()
  const nextStatus = isCompleted ? "PENDING" : "COMPLETED"

  const toggleComplete = () => {
    const body: Omit<TGetTaskResponseSchemaDto, "id" | "tags"> = {
      title,
      status: nextStatus,
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
  }

  const deleteMutation = useMutation({
    mutationKey: ["delete-task", id],
    mutationFn: async (taskId: string) => {
      return fetchData({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      })
    },
  })

  const onDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
        toast.success("Task deleted successfully.")
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error))
      },
    })
  }

  const statusConfig = {
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-700",
    FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  } as const

  return (
    <Item
      variant="outline"
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-background px-4 py-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md",
        isOverdue && "border-destructive/20"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-transparent transition-colors",
          isCompleted && "bg-emerald-500/70",
          isOverdue && "bg-destructive/70",
          !isCompleted && !isOverdue && "group-hover:bg-primary/40"
        )}
      />

      <ItemContent
        onClick={onEdit}
        className="flex min-w-0 cursor-pointer flex-row items-start gap-4"
      >
        <div className="pt-0.5">
          <Checkbox
            id={id}
            checked={isCompleted}
            onCheckedChange={toggleComplete}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mark "${title}" as complete`}
            className="size-5 rounded-md border-muted-foreground/30 transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <ItemTitle
                className={cn(
                  "line-clamp-2 text-[15px] leading-6 font-semibold tracking-tight text-foreground transition-all sm:text-base",
                  isCompleted && "text-muted-foreground line-through opacity-70"
                )}
              >
                {title}
              </ItemTitle>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm",
                    statusConfig[status as keyof typeof statusConfig]
                  )}
                >
                  {TASK_STATUS_MAP[status] || ""}
                </Badge>

                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] shadow-sm",
                    isOverdue
                      ? "border-destructive/20 bg-destructive/5 text-destructive"
                      : "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  {isOverdue ? (
                    <Clock3 className="size-3.5" />
                  ) : (
                    <CalendarDays className="size-3.5" />
                  )}
                  <span className="font-medium">
                    {isOverdue ? "Expired" : "Due"}
                  </span>
                  <span>{format(new Date(expiredAt), DATETIME_FORMAT)}</span>
                </div>
              </div>
            </div>

            <ItemActions className="shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomAlertDialog
                  title="Delete task?"
                  description="This action cannot be undone. This task will be permanently deleted."
                  onAccept={onDelete}
                  acceptTitle={
                    deleteMutation.isPending ? "Deleting..." : "Delete"
                  }
                />
              </div>
            </ItemActions>
          </div>

          {tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="size-3.5" />
                <span>Tags</span>
              </div>

              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-muted"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}
