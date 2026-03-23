"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { FormItem, IFormItemProps } from "@/components/form/form-item"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { registerRequestSchema, TRegisterRequestDto } from "@/types/register"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<TRegisterRequestDto>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: TRegisterRequestDto) {
    const { confirmPassword, ...body } = data
    try {
      await fetchData<null>({
        url: `/auth/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })

      toast.success("Register successful")
      router.push("/login")
    } catch (error) {
      toast.error(handleErrorMessage(error))
    }
  }

  const formItems: IFormItemProps<TRegisterRequestDto>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      placeholder: "Rewrite your password",
      type: "password",
    },
  ]

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="justify-center">
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form id="Register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {formItems.map((item) => (
                <FormItem key={item.name} {...item} />
              ))}
              <Button
                type="submit"
                form="Register-form"
                className="mx-auto block w-full shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
              >
                Register
              </Button>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border/50 sm:flex-row">
        <p className="gap-10 text-sm text-muted-foreground">
          You have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 transition-all hover:underline"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
