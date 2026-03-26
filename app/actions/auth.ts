"use server"

import { TLoginResponseDto } from "@/types/login"
import { cookies } from "next/headers"

export async function setTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()

  cookieStore.set("accessToken", accessToken)
  cookieStore.set("refreshToken", refreshToken)
}

export async function removeTokens() {
  const cookieStore = await cookies()

  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
}

export async function getTokens(): Promise<Partial<TLoginResponseDto>> {
  const cookieStore = await cookies()

  return {
    accessToken: cookieStore.get("accessToken")?.value,
    refreshToken: cookieStore.get("refreshToken")?.value,
  }
}
