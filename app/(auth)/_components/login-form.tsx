"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { setTokens } from "@/app/actions/auth"
import { FormItem } from "@/components/form/form-item"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { LOGIN_FORM_METADATA } from "@/constants/auth-form-meta"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import {
  loginRequestSchema,
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/types/login"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginForm() {
  const queryClient = useQueryClient()
  const form = useForm<TLoginRequestDto>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: TLoginRequestDto) {
    try {
      const response = await fetchData<TLoginResponseDto>({
        url: `/auth/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      const { accessToken, refreshToken } = response.data

      await setTokens(accessToken, refreshToken)
      await queryClient.invalidateQueries({ queryKey: ["me"] })
    } catch (e) {
      toast.error(handleErrorMessage(e))
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="justify-center">
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {LOGIN_FORM_METADATA.map((item) => (
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
