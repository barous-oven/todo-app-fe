import { getTokens, removeTokens, setTokens } from "@/app/actions/auth"
import { TLoginResponseDto } from "@/types/login"
import { TMeta } from "@/types/pagination"
import { buildQuery } from "./build-query"

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

let promiseRefresh: Promise<void> | null = null

export async function handleRefreshToken(refreshToken: string): Promise<void> {
  if (!promiseRefresh) {
    promiseRefresh = (async () => {
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

      const tokens = responseJson.data
      await setTokens(tokens.accessToken, tokens.refreshToken)
    })()
  }

  return promiseRefresh.finally(() => {
    promiseRefresh = null
  })
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

  if (response.ok) {
    return {
      status: response.status,
      message: responseJson?.message || "Success",
      data: responseJson?.data ?? responseJson,
      meta: responseJson?.meta,
    }
  }
  if (response.status === 401 && refreshToken) {
    try {
      await handleRefreshToken(refreshToken)
      return fetchData<T>(req)
    } catch {
      await removeTokens()
    }
  }

  throw new Error(responseJson?.message || response.statusText)
}
