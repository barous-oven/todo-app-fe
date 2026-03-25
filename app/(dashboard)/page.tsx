"use client"

import { useAuth } from "@/components/auth-provider"
import { CustomDropDown } from "@/components/custom-dropdown/custom-dropdown"
import { PageHeader } from "@/components/page-header"
import { CommonPagination } from "@/components/pagination"
import { TaskDialog } from "@/components/task/task-dialog"
import { TaskItem } from "@/components/task/task-item"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useEffect, useState } from "react"
import { toast } from "sonner"

type TQueryOptions = {
  title: string
  status?: TTaskStatus | "ALL"
  page: number
  limit: number
}

export default function TasksPage() {
  const { accessToken } = useAuth()
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [selectedTask, setSelectedTask] =
    useState<TGetTaskResponseSchemaDto | null>(null)
  const [queryParams, setQueryParams] = useState<TQueryOptions>({
    title: "",
    page: 1,
    limit: 5,
  })

  function onEdit(task: TGetTaskResponseSchemaDto): void {
    setSelectedTask(task)
    setOpenTaskDialog(true)
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
        method: "GET",
        queryParams,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.data || !response.meta) {
        throw new Error("Something went wrong!")
      }

      return response
    },
    enabled: !!accessToken,
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
          setOpenTaskDialog(true)
        }}
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

      <TaskDialog
        open={openTaskDialog}
        onOpenChange={setOpenTaskDialog}
        taskId={selectedTask?.id}
      />
    </div>
  )
}
