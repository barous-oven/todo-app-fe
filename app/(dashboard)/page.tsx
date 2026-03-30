"use client"

import { CustomDropDown } from "@/components/custom/custom-dropdown"
import { PageHeader } from "@/components/page-header"
import { CommonPagination } from "@/components/pagination"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import CreateTaskWithAIDialog from "@/components/task/create-task-with-ai-dialog"
import { TaskItem } from "@/components/task/task-item"
import { UpdateTaskDialog } from "@/components/task/update-task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import {
  TASK_STATUS_LABEL,
  TGetTaskResponseSchemaDto,
  TTaskStatus,
} from "@/types/task"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type TQueryOptions = {
  title: string
  status?: TTaskStatus | "ALL"
  page: number
  limit: number
}

export default function TasksPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openAICreateDialog, setOpenAICreateDialog] = useState(false)
  const [selectedTask, setSelectedTask] =
    useState<TGetTaskResponseSchemaDto | null>(null)
  const [queryParams, setQueryParams] = useState<TQueryOptions>({
    title: "",
    page: 1,
    limit: 5,
  })

  function onEdit(task: TGetTaskResponseSchemaDto): void {
    setSelectedTask(task)
    setOpenUpdateDialog(true)
  }

  function setQuery(value: Partial<TQueryOptions>): void {
    setQueryParams((prev) => {
      const finalQuery = { ...prev, ...value }
      if (!value.page) {
        finalQuery.page = 1
      }
      if (finalQuery.status === "ALL") {
        const { status, ...rest } = finalQuery
        return rest
      }
      return finalQuery
    })
  }

  const { data, isLoading, isError, error } = useQuery<
    ApiResponse<TGetTaskResponseSchemaDto[]>
  >({
    queryKey: ["tasks", queryParams],
    queryFn: async () => {
      const response = await fetchData<TGetTaskResponseSchemaDto[]>({
        url: "/tasks",
        queryParams,
      })

      if (!response.data || !response.meta) {
        throw new Error("Something went wrong!")
      }

      return response
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(handleErrorMessage(error))
    }
  }, [isError, error])

  const tasks = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        pageName="Tasks"
        pageDescription="Manage your personal workflow and deadlines."
        onCreate={() => {
          setSelectedTask(null)
          setOpenCreateDialog(true)
        }}
        children={
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setOpenAICreateDialog(true)}
          >
            <Plus className="h-4 w-4" />
            New with AI
          </Button>
        }
      />
      <div className="mb-6 flex items-center gap-2">
        <Input
          placeholder="Search tasks..."
          type="search"
          onChange={(e) => setQuery({ title: e.target.value })}
        />
        <CustomDropDown buttonLabel="..." label="Filter">
          <Select
            value={queryParams.status}
            onValueChange={(status: TTaskStatus | "ALL") =>
              setQuery({ status })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem key="ALL" value="ALL">
                  All
                </SelectItem>
                {TASK_STATUS_LABEL.map((item) => (
                  <SelectItem key={item.label} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CustomDropDown>
      </div>
      <ItemGroup className="gap-3">
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Loading tasks...
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} {...task} onEdit={() => onEdit(task)} />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            No tasks found.
          </div>
        )}

        {meta && (
          <CommonPagination
            {...meta}
            onPageChange={(page) => setQuery({ page })}
          />
        )}
      </ItemGroup>
      <CreateTaskDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <UpdateTaskDialog
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        taskId={selectedTask?.id}
      />
      <CreateTaskWithAIDialog
        open={openAICreateDialog}
        onOpenChange={setOpenAICreateDialog}
      />
    </div>
  )
}
