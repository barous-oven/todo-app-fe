import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import useTagUpdate from "@/hooks/use-tag-update"
import { fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TGetTagResponse } from "@/types/tags"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import CustomAlertDialog from "../custom/custom-alert-dialog"
import { FieldLabel } from "../ui/field"

type TagItemProps = TGetTagResponse & {
  onEdit: () => void
}

export function TagItem({ id, title, description, onEdit }: TagItemProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationKey: ["tags"],
    mutationFn: async (tagId: string) => {
      fetchData({
        url: `/tags/${tagId}`,
        method: "DELETE",
      })
    },
  })
  const onDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tags"] })
        toast.success("Delete successfully!")
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error))
      },
    })
  }

  return (
    <Item
      variant="outline"
      className="group w-full cursor-pointer bg-white py-3"
    >
      <ItemContent className="flex flex-col gap-2" onClick={onEdit}>
        <div className="flex items-center gap-3">
          <FieldLabel className="w-full cursor-pointer" id={id}>
            <ItemTitle className={`cursor-pointer transition-all duration-300`}>
              {title}
            </ItemTitle>
          </FieldLabel>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </ItemContent>

      <ItemActions>
        <CustomAlertDialog
          title="Delete tag?"
          description="This action cannot be undone. This tag will be permanently deleted."
          onAccept={onDelete}
          acceptTitle="Delete"
        />
      </ItemActions>
    </Item>
  )
}
