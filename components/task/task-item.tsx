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
import { useState } from "react"
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
  const [isCompleted, setIsCompleted] = useState(status === "COMPLETED")
  const { accessToken } = useAuth()
  const isOverdue = new Date(expiredAt) < new Date() && !isCompleted
  const queryClient = useQueryClient()

  const updateMutation = useTaskUpdate(id)

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
          setIsCompleted(!isCompleted)
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    <FieldLabel className="w-full" id={id}>
      <Item variant="outline" className="group w-full py-3">
        <ItemContent className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={isCompleted}
              onCheckedChange={toggleComplete}
              aria-label={`Mark "${title}" as complete`}
            />
            <ItemTitle
              className={`transition-all duration-300 ${
                isCompleted
                  ? "text-muted-foreground line-through opacity-60"
                  : ""
              }`}
            >
              {title}
            </ItemTitle>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem id="edit" onClickCapture={onEdit}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem id="delete" onClick={onDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>
    </FieldLabel>
  )
}
