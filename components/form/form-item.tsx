import { TSelectOptions } from "@/types/select-options"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { FormField, TInputType } from "./form-field"
import { IFormItemProps } from "@/types/form-item"

function FormItem<T extends FieldValues>({
  name,
  label,
  ...props
}: IFormItemProps<T>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <FormField {...props} field={field} fieldState={fieldState} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export { FormItem }
