import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "../ui/field"
import { Input } from "../ui/input"

export interface IFormItemProps<T extends FieldValues> {
  name: Path<T>
  label: string
  placeholder?: string
  type?: string // TODO: handle type enum
}

function FormItem<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
}: IFormItemProps<T>) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            id={name}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="on"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export { FormItem }
