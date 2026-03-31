import { FieldValues, Path } from "react-hook-form"
import { TSelectOptions } from "./select-options"
import { DateTimePickerProps } from "@/components/ui/date-time-picker"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"

export type IFormItemProps<T extends FieldValues> = {
  name: Path<T>
  label: string
} & TFormField

export type TFormField =
  | TSelectItemProps
  | TInputItemProps
  | TInputPasswordProps
  | TDatetimePickProps
  | TTextAreaItemProps
  | TMultiSelectItemProps

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

type TTextAreaItemProps = {
  type: "textarea"
  props: React.ComponentProps<"textarea">
}

type TMultiSelectItemProps = {
  type: "multi-select"
  props: Omit<React.ComponentProps<typeof MultiSelect>, "onValueChange">
}
