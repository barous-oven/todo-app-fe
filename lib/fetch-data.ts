type PaginationMeta = {
  total: number
  totalPage: number
}

type ApiResponse<T> = {
  status: number
  message?: string | string[]
  error?: string
  data?: T
  meta?: PaginationMeta
}

type ApiRequest = {
  url: string
  method?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH"
  headers?: HeadersInit
  queryParams?: Record<string, string | number>
  body?: unknown
}

export async function fetchData<T>(req: ApiRequest): Promise<ApiResponse<T>> {
  let finalUrl = req.url

  if (req.queryParams) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(req.queryParams)) {
      params.append(key, value.toString())
    }

    finalUrl = `${req.url}?${params.toString()}`
  }

  const response = await fetch(finalUrl, {
    method: req.method ?? "GET",
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const responseJson = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(responseJson?.message || response.statusText)
  }

  return {
    status: response.status,
    message: responseJson?.message || "Success",
    data: responseJson?.data ?? responseJson,
    meta: responseJson?.meta,
  }
}
