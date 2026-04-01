import { format } from "date-fns"
import { CalendarDays, Clock3 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { FieldLabel } from "@/components/ui/field"
import { DATETIME_FORMAT } from "@/constants/datetime-format"
import { TASK_STATUS_MAP } from "@/constants/task-constant"
import { TGetTaskDetailResponseSchemaDto } from "@/types/task"
import CustomAlertDialog from "../custom/custom-alert-dialog"
import { cn } from "@/lib/utils"

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

  const statusConfig = {
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-700",
  } as const

  return (
    <Item
      variant="outline"
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-background px-4 py-4 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md",
        isOverdue && "border-destructive/20"
      )}
    >
      {/* left accent */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-transparent",
          isOverdue && "bg-destructive/70",
          !isOverdue && "group-hover:bg-primary/40"
        )}
      />

      <ItemContent className="flex flex-col gap-3">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <FieldLabel id={id ?? title} className="w-full">
            <ItemTitle className="text-base leading-6 font-semibold tracking-tight">
              {title}
            </ItemTitle>
          </FieldLabel>

          <ItemActions className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <div onClick={(e) => e.stopPropagation()}>
              <CustomAlertDialog
                title="Delete task?"
                description="This action cannot be undone. This task will be permanently deleted."
                onAccept={onDelete}
                acceptTitle="Delete"
              />
            </div>
          </ItemActions>
        </div>

        {/* description */}
        {description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {/* meta */}
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

            <span className="font-medium">{isOverdue ? "Expired" : "Due"}</span>

            <span>{format(new Date(expiredAt), DATETIME_FORMAT)}</span>
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
