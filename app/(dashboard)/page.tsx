"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search, SlidersHorizontal, ListTodo } from "lucide-react"
import { toast } from "sonner"

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
import { TASK_STATUS_LABEL } from "@/constants/task-constant"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TGetTagResponse } from "@/types/tags"
import { TGetTaskResponseSchemaDto, TTaskStatus } from "@/types/task"

type TTaskQueryOptions = {
  title: string
  status?: TTaskStatus | "ALL"
  tagId?: string | "ALL"
  page: number
  limit: number
}

type TTagQueryOptions = {
  title: string
  page: number
  limit: number
}

export default function TasksPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedTask, setSelectedTask] =
    useState<TGetTaskResponseSchemaDto | null>(null)

  const [queryParams, setQueryParams] = useState<TTaskQueryOptions>({
    title: "",
    page: 1,
    limit: 5,
  })

  const [tagQueryParams] = useState<TTagQueryOptions>({
    title: "",
    page: 1,
    limit: 50,
  })

  function onEdit(task: TGetTaskResponseSchemaDto): void {
    setSelectedTask(task)
    setOpenUpdateDialog(true)
  }

  function setQuery(value: Partial<TTaskQueryOptions>): void {
    setQueryParams((prev) => {
      const next = { ...prev, ...value }

      if (value.page === undefined) {
        next.page = 1
      }

      if (next.status === "ALL") {
        delete next.status
      }

      if (next.tagId === "ALL") {
        delete next.tagId
      }

      return next
    })
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (queryParams.status) count += 1
    if (queryParams.tagId) count += 1
    return count
  }, [queryParams.status, queryParams.tagId])

  const { data, isLoading, isError, error, isFetching } = useQuery<
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

  const tagsQuery = useQuery<ApiResponse<TGetTagResponse[]>>({
    queryKey: ["tags", tagQueryParams],
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

  const tasks = data?.data ?? []
  const meta = data?.meta
  const tags = tagsQuery.data?.data ?? []

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        pageName="Tasks"
        pageDescription="Manage your personal workflow and deadlines."
      >
        <Button
          className="h-9 gap-2 rounded-lg px-4"
          onClick={() => {
            setSelectedTask(null)
            setOpenCreateDialog(true)
          }}
        >
          <Plus className="size-4" />
          New task
        </Button>
      </PageHeader>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks by title..."
              value={queryParams.title}
              onChange={(e) => setQuery({ title: e.target.value })}
              className="h-10 rounded-lg pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <CustomDropDown
              label="Filters"
              trigger={
                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-lg px-3"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            >
              <div className="w-48 space-y-2 p-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Status
                  </span>
                  <Select
                    value={queryParams.status ?? "ALL"}
                    onValueChange={(status: TTaskStatus | "ALL") =>
                      setQuery({ status })
                    }
                  >
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ALL">All statuses</SelectItem>
                        {TASK_STATUS_LABEL.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Tag
                  </span>
                  <Select
                    value={queryParams.tagId ?? "ALL"}
                    onValueChange={(tagId: string | "ALL") =>
                      setQuery({ tagId })
                    }
                  >
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ALL">All tags</SelectItem>
                        {tags.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {(queryParams.status || queryParams.tagId) && (
                  <Button
                    variant="ghost"
                    className="w-full justify-center rounded-lg"
                    onClick={() => setQuery({ status: "ALL", tagId: "ALL" })}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CustomDropDown>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Task list</h2>
            <p className="text-sm text-muted-foreground">
              {isFetching ? "Updating..." : `${tasks.length} task(s) shown`}
            </p>
          </div>
        </div>

        <ItemGroup className="gap-3">
          {isLoading ? (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-4 text-center">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                <ListTodo className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Loading tasks...</p>
              <p className="text-sm text-muted-foreground">
                Please wait a moment.
              </p>
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem key={task.id} {...task} onEdit={() => onEdit(task)} />
            ))
          ) : (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-4 text-center">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                <ListTodo className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                Try changing your search or filters, or create a new task.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-lg"
                onClick={() => {
                  setSelectedTask(null)
                  setOpenCreateDialog(true)
                }}
              >
                <Plus className="mr-2 size-4" />
                Create task
              </Button>
            </div>
          )}

          {meta && (
            <div className="pt-2">
              <CommonPagination
                {...meta}
                onPageChange={(page) => setQuery({ page })}
              />
            </div>
          )}
        </ItemGroup>
      </div>

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
