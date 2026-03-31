import { fetchData } from "@/lib/fetch-data"
import { TGetTagResponse } from "@/types/tags"
import { useMutation } from "@tanstack/react-query"

export default function useTagUpdate(id: string) {
  return useMutation({
    mutationKey: ["tags"],
    mutationFn: async (body: Omit<TGetTagResponse, "id">) =>
      fetchData<TGetTagResponse[]>({
        url: `/tags/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
  })
}
