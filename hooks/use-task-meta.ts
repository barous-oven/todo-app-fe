import { IFormItemProps } from "@/types/form-item"
import { startOfToday } from "date-fns"
import {
  TGetTaskDetailResponseSchemaDto,
  TASK_STATUS_LABEL,
} from "@/types/task"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import { useQuery } from "@tanstack/react-query"
import { TSelectOptions } from "@/types/select-options"
import { TGetTagResponse } from "@/types/tags"

export const useTaskMetadata = (type: "create" | "update") => {
  const tagsData = useQuery<ApiResponse<TGetTagResponse[]>>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetchData<TGetTagResponse[]>({
        url: "/tags",
      })

      if (!response.data || !response.meta) {
        throw new Error("Something went wrong!")
      }

      return response
    },
  })

  const tagsOption: TSelectOptions[] = tagsData.data?.data
    ? tagsData.data?.data.map((tag) => {
        return { value: tag.id, label: tag.title }
      })
    : []

  const metadata: IFormItemProps<TGetTaskDetailResponseSchemaDto>[] = [
    {
      name: "title",
      type: "text",
      label: "Title",
      props: {
        placeholder: "Title",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      props: {
        placeholder: "Description",
      },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      props: {
        selectOptions: TASK_STATUS_LABEL,
      },
    },
    {
      name: "tagIds",
      label: "Tags",
      type: "multi-select",
      props: {
        options: tagsOption,
      },
    },
    {
      name: "expiredAt",
      label: "Expire At",
      type: "datetime-picker",
      props: {
        calendarProps: {
          disabled: (date: Date) => {
            return date < startOfToday()
          },
        },
      },
    },
  ]

  if (type === "create") {
    return metadata.filter((field) => field.name !== "status")
  }

  return metadata
}
