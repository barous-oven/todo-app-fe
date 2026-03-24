import { FieldValues, Path } from "react-hook-form"
import { TSelectOptions } from "./select-options"
import { DateTimePickerProps } from "@/components/ui/date-time-picker"

export type IFormItemProps<T extends FieldValues> = {
  name: Path<T>
  label: string
} & TFormField

export type TFormField =
  | TSelectItemProps
  | TInputItemProps
  | TInputPasswordProps
  | TDatetimePickProps

export type TInputType = TFormField["type"]

type TSelectItemProps = {
  type: "select"
  props: {
    placeholder?: string
    selectOptions: TSelectOptions[]
  }
}

type TInputItemProps = {
  type: "text"
  props: React.ComponentProps<"input">
}

type TInputPasswordProps = {
  type: "password"
  props: React.ComponentProps<"input">
}

type TDatetimePickProps = {
  type: "datetime-picker"
  props?: DateTimePickerProps
}
