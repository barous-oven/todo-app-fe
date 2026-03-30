import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { DATETIME_FORMAT } from "@/constants/datetime-format"
import useTaskUpdate from "@/hooks/use-task-update"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { taskStatusMap, TGetTaskResponseSchemaDto } from "@/types/task"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { toast } from "sonner"
import { useAuth } from "../auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { FieldLabel } from "../ui/field"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

type TaskItemProps = TGetTaskResponseSchemaDto & {
  onEdit: () => void
}

export function TaskItem({
  id,
  title,
  status,
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

      const body: Omit<TGetTaskResponseSchemaDto, "id"> = {
        title,
        status,
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
    <Item variant="outline" className="group w-full cursor-pointer py-3">
      <ItemContent className="flex flex-col gap-2" onClick={onEdit}>
        <div className="flex items-center gap-3">
          <Checkbox
            id={id}
            checked={isCompleted}
            onCheckedChange={toggleComplete}
            aria-label={`Mark "${title}" as complete`}
            className="cursor-pointer hover:border-primary hover:bg-primary/10"
          />
          <FieldLabel className="w-full cursor-pointer" id={id}>
            <ItemTitle
              className={`cursor-pointer transition-all duration-300 ${
                isCompleted
                  ? "text-muted-foreground line-through opacity-60"
                  : ""
              }`}
            >
              {title}
            </ItemTitle>
          </FieldLabel>
        </div>

        <div className="flex items-center gap-2 pl-8 text-xs text-muted-foreground">
          <Badge
            variant={isCompleted ? "secondary" : "outline"}
            className="capitalize"
          >
            {taskStatusMap[status] || ""}
          </Badge>
          <span>•</span>
          <span className={isOverdue ? "font-medium text-destructive" : ""}>
            {isOverdue ? "Expired: " : "Expires at: "}{" "}
            {format(expiredAt, DATETIME_FORMAT)}
          </span>
        </div>
      </ItemContent>

      <ItemActions>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This task will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  )
}
