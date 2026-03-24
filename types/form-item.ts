import { TInputType } from "@/components/form/form-field"
import { FieldValues, Path } from "react-hook-form"
import { TSelectOptions } from "./select-options"

type TOtherItemProps = {
  type: TInputType
  placeholder?: string
}

export type IFormItemProps<T extends FieldValues> = {
  name: Path<T>
  label: string
} & (TSelectItemProps | TOtherItemProps)

type TSelectItemProps = {
  type: "select"
  selectOptions: TSelectOptions[]
}
