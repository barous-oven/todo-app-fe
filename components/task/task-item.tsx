import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { taskStatusMap, TGetTaskResponseSchemaDto } from "@/types/task"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { FieldLabel } from "../ui/field"
import { fetchData } from "@/lib/fetch-data"
import { useAuth } from "../auth-provider"
import { toast } from "sonner"
import handleErrorMessage from "@/lib/handle-error-message"
import { QueryClient, useQueryClient } from "@tanstack/react-query"

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

  const toggleComplete = async () => {
    try {
      status = !isCompleted ? "COMPLETED" : "PENDING"

      const body: Omit<TGetTaskResponseSchemaDto, "id"> = {
        title,
        status,
        expiredAt,
      }

      // TODO: useMutation
      const response = await fetchData<TGetTaskResponseSchemaDto[]>({
        url: `/tasks/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      })

      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }
      setIsCompleted(!isCompleted)
    } catch (error) {
      toast.error(handleErrorMessage(error))
    }
  }

  const onDelete = () => {
    console.log("Deleted!")
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
              {isOverdue ? "Expired: " : "Expires at: "} {expiredAt}
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
