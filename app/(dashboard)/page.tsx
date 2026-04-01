"use client"

import { CustomDropDown } from "@/components/custom/custom-dropdown"
import { PageHeader } from "@/components/page-header"
import { CommonPagination } from "@/components/pagination"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
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
import { TGetTagResponse } from "@/types/tags"
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
  tag?: string | "ALL"
  page: number
  limit: number
}

export default function TasksPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedTask, setSelectedTask] =
    useState<TGetTaskResponseSchemaDto | null>(null)
  const [queryParams, setQueryParams] = useState<TQueryOptions>({
    title: "",
    page: 1,
    limit: 5,
  })
  const [tagQueryParams, setTagQueryParams] = useState<TQueryOptions>({
    title: "",
    page: 1,
    limit: 10,
  })

  function onEdit(task: TGetTaskResponseSchemaDto): void {
    setSelectedTask(task)
    setOpenUpdateDialog(true)
  }

  function setQuery(value: Partial<TQueryOptions>): void {
    setQueryParams((prev) => {
      const finalQuery = { ...prev, ...value }

      if (value.page === undefined) {
        finalQuery.page = 1
      }

      if (finalQuery.status === "ALL") {
        delete finalQuery.status
      }

      if (finalQuery.tag === "ALL") {
        delete finalQuery.tag
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

  const tagsData = useQuery<ApiResponse<TGetTagResponse[]>>({
    queryKey: ["tasks", tagQueryParams],
    queryFn: async () => {
      const response = await fetchData<TGetTagResponse[]>({
        url: "/tags",
        queryParams: tagQueryParams,
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

  const tags = tagsData.data?.data ?? []

  const tasks = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        pageName="Tasks"
        pageDescription="Manage your personal workflow and deadlines."
      >
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setSelectedTask(null)
              setOpenCreateDialog(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </PageHeader>
      <div className="mb-6 flex items-center gap-2">
        <Input
          placeholder="Search tasks..."
          type="search"
          onChange={(e) => setQuery({ title: e.target.value })}
        />
        <CustomDropDown buttonLabel="..." label="Filter">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Status
              </span>
              <Select
                value={queryParams.status ?? "ALL"}
                onValueChange={(status: TTaskStatus | "ALL") =>
                  setQuery({ status })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">All</SelectItem>
                    {TASK_STATUS_LABEL.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Tag
              </span>
              <Select
                value={queryParams.tag ?? "ALL"}
                onValueChange={(tag: string | "ALL") => setQuery({ tag })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">All</SelectItem>
                    {tags.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
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
    </div>
  )
}
