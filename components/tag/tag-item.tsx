import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Hash } from "lucide-react"
import { toast } from "sonner"

import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { FieldLabel } from "@/components/ui/field"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TGetTagResponse } from "@/types/tags"
import { cn } from "@/lib/utils"
import CustomAlertDialog from "../custom/custom-alert-dialog"

type TagItemProps = TGetTagResponse & {
  onEdit: () => void
}

export function TagItem({ id, title, description, onEdit }: TagItemProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationKey: ["delete-tag", id],
    mutationFn: async (tagId: string) => {
      return fetchData({
        url: `/tags/${tagId}`,
        method: "DELETE",
      })
    },
  })

  const onDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tags"] })
        toast.success("Tag deleted successfully.")
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error))
      },
    })
  }

  return (
    <Item
      variant="outline"
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-background px-4 py-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-transparent transition-colors group-hover:bg-primary/40" />

      <ItemContent
        onClick={onEdit}
        className="flex min-w-0 cursor-pointer flex-row items-start gap-4"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted/40 text-muted-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary">
          <Hash className="size-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <FieldLabel id={id} className="block w-full cursor-pointer">
              <ItemTitle className="line-clamp-1 text-[15px] leading-6 font-semibold tracking-tight text-foreground sm:text-base">
                {title}
              </ItemTitle>
            </FieldLabel>

            <ItemActions className="shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomAlertDialog
                  title="Delete tag?"
                  description="This action cannot be undone. This tag will be permanently deleted."
                  onAccept={onDelete}
                  acceptTitle={
                    deleteMutation.isPending ? "Deleting..." : "Delete"
                  }
                />
              </div>
            </ItemActions>
          </div>

          {description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/80 italic">
              No description
            </p>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}
