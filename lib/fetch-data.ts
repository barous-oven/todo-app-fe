import { TMeta } from "@/types/pagination"
import { buildQuery } from "./build-query"
import { getTokens, removeTokens, setTokens } from "@/app/actions/auth"
import { TLoginResponseDto } from "@/types/login"
import { redirect } from "next/navigation"

export type ApiResponse<T> = {
  status: number
  message?: string | string[]
  error?: string
  data?: T
  meta?: TMeta
}

type ApiRequest = {
  url: string
  method?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH"
  headers?: HeadersInit
  queryParams?: Record<string, string | number>
  body?: unknown
}

const BASE_URL = "/api"

async function handleRefreshToken(
  refreshToken: string
): Promise<TLoginResponseDto> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  const responseJson = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(responseJson?.message || "Refresh token failed")
  }

  return responseJson.data
}

export async function fetchData<T>(req: ApiRequest): Promise<ApiResponse<T>> {
  let finalUrl = BASE_URL + req.url
  const { accessToken, refreshToken } = await getTokens()

  if (req.queryParams) {
    finalUrl += `?${buildQuery(req.queryParams)}`
  }

  const response = await fetch(finalUrl, {
    method: req.method ?? "GET",
    headers: {
      ...req.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const responseJson = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      if (!refreshToken) {
        await removeTokens()
        throw new Error("Session expired")
      }

      try {
        const tokens = await handleRefreshToken(refreshToken)
        await setTokens(tokens.accessToken, tokens.refreshToken)
        return fetchData<T>(req)
      } catch {
        await removeTokens()
      }
    }

    throw new Error(responseJson?.message || response.statusText)
  }

  return {
    status: response.status,
    message: responseJson?.message || "Success",
    data: responseJson?.data ?? responseJson,
    meta: responseJson?.meta,
  }
}
