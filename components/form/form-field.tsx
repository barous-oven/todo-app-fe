import { TFormField, TInputType } from "@/types/form-item"
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
import { Textarea } from "../ui/textarea"

type TFormFieldProps<T> = {
  field: ControllerRenderProps<FieldValues, Path<T>>
  fieldState: ControllerFieldState
  type: TInputType
} & TFormField

export function FormField<T>({
  field,
  fieldState,
  type,
  props,
}: TFormFieldProps<T>) {
  switch (type) {
    case "select": {
      return (
        <Select {...field} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {props.selectOptions?.map((item) => (
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
      return <DateTimePicker {...field} {...props} />
    }
    case "textarea": {
      return <Textarea {...field} id={field.name} {...props} />
    }

    default: {
      return (
        <Input
          {...field}
          id={field.name}
          type={type}
          aria-invalid={fieldState.invalid}
          placeholder={props.placeholder}
          autoComplete="on"
        />
      )
    }
  }
}
