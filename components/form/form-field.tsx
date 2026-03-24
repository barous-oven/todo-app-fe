import { TSelectOptions } from "@/types/select-options"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"
import { DateTimePicker } from "../ui/date-time-picker"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
export type TInputType = "password" | "text" | "select" | "datetime-picker"

type TFormFieldProps<T> = {
  field: ControllerRenderProps<FieldValues, Path<T>>
  fieldState: ControllerFieldState
  type: TInputType
  placeholder?: string
  selectOptions?: TSelectOptions[]
}

export function FormField<T>({
  field,
  fieldState,
  type,
  placeholder,
  selectOptions,
}: TFormFieldProps<T>) {
  switch (type) {
    case "select": {
      return (
        <Select {...field} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectOptions?.map((item) => (
                <SelectItem key={item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              )) || []}
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
    case "datetime-picker": {
      return <DateTimePicker {...field} />
    }

    default: {
      return (
        <Input
          {...field}
          id={field.name}
          type={type}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="on"
        />
      )
    }
  }
}
