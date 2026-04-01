import { IFormItemProps } from "@/types/form-item"
import { TLoginRequestDto } from "@/types/login"
import { TRegisterRequestDto } from "@/types/register"

export const LOGIN_FORM_METADATA: IFormItemProps<TLoginRequestDto>[] = [
  {
    name: "email",
    label: "Email",
    type: "text",
    props: {
      placeholder: "Enter your email",
    },
  },
  {
    name: "password",
    label: "Password",
    props: {
      placeholder: "Enter your password",
    },
    type: "password",
  },
]

export const REGISTER_FORM_METADATA: IFormItemProps<TRegisterRequestDto>[] = [
  {
    name: "email",
    type: "text",
    label: "Email",
    props: {
      placeholder: "Enter your email",
    },
  },
  {
    name: "name",
    type: "text",
    label: "Name",
    props: {
      placeholder: "Enter your name",
    },
  },
  {
    name: "password",
    label: "Password",
    props: {
      placeholder: "Enter your password",
    },
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    props: {
      placeholder: "Rewrite your password",
    },
    type: "password",
  },
]
