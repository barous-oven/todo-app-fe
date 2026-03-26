import { useAuth } from "@/components/auth-provider"
import { fetchData } from "@/lib/fetch-data"
import { TGetTaskResponseSchemaDto } from "@/types/task"
import { useMutation } from "@tanstack/react-query"

export default function useTaskUpdate(id: string) {
  return useMutation({
    mutationKey: ["tasks"],
    mutationFn: async (body: Omit<TGetTaskResponseSchemaDto, "id">) =>
      fetchData<TGetTaskResponseSchemaDto[]>({
        url: `/tasks/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
  })
}
