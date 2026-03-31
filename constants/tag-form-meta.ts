import { IFormItemProps } from "@/types/form-item"
import { TGetTagResponse } from "@/types/tags"

export const TAG_FORM_METADATA: IFormItemProps<TGetTagResponse>[] = [
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
]
