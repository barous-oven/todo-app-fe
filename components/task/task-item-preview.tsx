import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { DATETIME_FORMAT } from "@/constants/datetime-format"
import { TGetTaskDetailResponseSchemaDto } from "@/types/task"
import { format } from "date-fns"
import CustomAlertDialog from "../custom/custom-alert-dialog"
import { FieldLabel } from "../ui/field"
import { TASK_STATUS_MAP } from "@/constants/task-constant"

type TaskItemProps = TGetTaskDetailResponseSchemaDto & {
  onDelete: () => void
}

export function TaskItemPreview({
  id,
  title,
  description,
  status,
  expiredAt,
  onDelete,
}: TaskItemProps) {
  const isOverdue = new Date(expiredAt) < new Date()

  return (
    <Item variant="outline" className="group w-full py-3">
      <ItemContent className="flex flex-col gap-3">
        <FieldLabel className="w-full space-y-1" id={id ?? title}>
          <ItemTitle className={`transition-all duration-300`}>
            {title}
          </ItemTitle>
        </FieldLabel>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          <Badge variant="outline" className="capitalize">
            {TASK_STATUS_MAP[status] || ""}
          </Badge>

          <span>•</span>

          <span className={isOverdue ? "font-medium text-destructive" : ""}>
            {isOverdue ? "Expired:" : "Expires at:"}{" "}
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
