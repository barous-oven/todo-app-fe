type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean | null | undefined)[]

export function buildQuery<T extends Record<string, QueryValue>>(
  params: T
): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParams.append(key, String(v))
        }
      })
    } else {
      searchParams.set(key, String(value))
    }
  })

  return searchParams.toString()
}
