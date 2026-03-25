import { IFormItemProps } from "@/types/form-item"
import {
  TGetTaskDetailResponseSchemaDto,
  TASK_STATUS_LABEL,
} from "@/types/task"

export const UPDATE_TASK_FORM_METADATA: IFormItemProps<TGetTaskDetailResponseSchemaDto>[] =
  [
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
      type: "text",
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
      name: "expiredAt",
      label: "Expire At",
      type: "datetime-picker",
    },
  ]

export const CREATE_TASK_FORM_METADATA = UPDATE_TASK_FORM_METADATA.filter(
  (item) => item.name !== "status"
)
