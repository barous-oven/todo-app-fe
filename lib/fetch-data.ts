import { TMeta } from "@/types/pagination"
import { buildQuery } from "./build-query"
import { removeTokens } from "@/app/actions/auth"

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

export async function fetchData<T>(req: ApiRequest): Promise<ApiResponse<T>> {
  let finalUrl = BASE_URL + req.url

  if (req.queryParams) {
    finalUrl += `?${buildQuery(req.queryParams)}`
  }

  const response = await fetch(finalUrl, {
    method: req.method ?? "GET",
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const responseJson = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      await removeTokens()
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
