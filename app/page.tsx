"use client"

import { CommonPagination } from "@/components/pagination"
import { useState } from "react"
import { TaskItem } from "@/components/task/task-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { TMeta } from "@/types/pagination"
import { TGetTaskResponseSchemaDto } from "@/types/task"
import { ListFilter } from "lucide-react"
import { PageHeader, TPageProps } from "@/components/page-header"
import { TaskDialog } from "@/components/task/task-dialog"

const tasks: TGetTaskResponseSchemaDto[] = [
  {
    id: "018fc70f-6b70-4367-a9e8-414df3058844",
    title: "Update design system documentation",
    status: "COMPLETED",
    expiredAt: "2026-03-18T10:13:39.000Z",
  },
  {
    id: "a9258449-4afe-430b-90e6-340722bbb503",
    title: "Implement new task filtering logic",
    status: "PENDING",
    expiredAt: "2026-03-25T10:13:39.000Z",
  },
  {
    id: "e40793c6-ca24-409e-9c40-63e71e798c08",
    title: "Finalize Q1 presentation slides",
    status: "PENDING",
    expiredAt: "2026-03-18T10:13:39.000Z",
  },
]

export default function TasksPage() {
  // TODO integate api
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [selectedTask, setSelectedTask] =
    useState<TGetTaskResponseSchemaDto | null>(null)

  function onEdit(task: TGetTaskResponseSchemaDto): void {
    setSelectedTask(task)
    setOpenTaskDialog(true)
  }

  const [currentPage, setCurrentPage] = useState(1)

  const meta: TMeta = {
    totalPages: 6,
    currentPage,
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        pageName="Tasks"
        pageDescription="Manage your personal workflow and deadlines."
        onCreate={() => {
          setSelectedTask(null)
          setOpenTaskDialog(true)
        }}
      />

      <div className="mb-6 flex items-center gap-2">
        <Input placeholder="Search tasks..." type="search" />
        <Button variant="outline" size="icon">
          <ListFilter className="h-4 w-4" />
        </Button>
      </div>

      <ItemGroup className="gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} {...task} onEdit={() => onEdit(task)} />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            No tasks found.
          </div>
        )}
        <CommonPagination {...meta} onPageChange={setCurrentPage} />
      </ItemGroup>

      <TaskDialog
        open={openTaskDialog}
        onOpenChange={setOpenTaskDialog}
        taskId={selectedTask?.id}
      />
    </div>
  )
}
