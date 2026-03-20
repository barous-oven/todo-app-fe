"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"

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
import Link from "next/link"
import { LoginRequestSchema, TLoginRequestDto } from "../../../types/login"

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginRequestSchema>>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: TLoginRequestDto) {
    console.log("🚀 ~ onSubmit ~ data:", data)
  }

  const fieldItems: IFormItemProps<TLoginRequestDto>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  ]

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="justify-center">
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {fieldItems.map((item) => (
                <FormItem key={item.name} {...item} />
              ))}
              <Button
                type="submit"
                form="login-form"
                className="mx-auto block w-full shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
              >
                Login
              </Button>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border/50 sm:flex-row">
        <p className="gap-10 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 transition-all hover:underline"
          >
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
