import { useState } from "react" // Thêm useState
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { taskStatusMap, TGetTaskResponseSchemaDto } from "@/types/task"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FieldLabel } from "../ui/field"
import { Label } from "@/components/ui/label"

type TaskItemProps = TGetTaskResponseSchemaDto & {
  onEditClick: () => void
}

export function TaskItem({
  id,
  title,
  status,
  expiredAt,
  onEditClick,
}: TaskItemProps) {
  // TODO integrate api
  const [isCompleted, setIsCompleted] = useState(status === "COMPLETED")

  const isOverdue = new Date(expiredAt) < new Date() && !isCompleted

  const toggleComplete = () => {
    setIsCompleted(!isCompleted)
  }

  return (
    <FieldLabel className="w-full" id={id}>
      <Item variant="outline" className="group w-full py-3">
        <ItemContent className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`task-${id}`}
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

        {/* TODO: change to menu item */}
        <ItemActions>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={onEditClick}
          >
            Edit
          </Button>
        </ItemActions>
      </Item>
    </FieldLabel>
  )
}
