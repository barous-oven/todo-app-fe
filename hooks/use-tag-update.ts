import { fetchData } from "@/lib/fetch-data"
import { TGetTagResponse } from "@/types/tags"
import { useMutation } from "@tanstack/react-query"

export default function useTaskUpdate(id: string) {
  return useMutation({
    mutationKey: ["tasks"],
    mutationFn: async (body: Omit<TGetTagResponse, "id">) =>
      fetchData<TGetTagResponse[]>({
        url: `/tasks/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
  })
}
