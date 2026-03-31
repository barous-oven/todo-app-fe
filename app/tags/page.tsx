"use client"

import { PageHeader } from "@/components/page-header"
import { CommonPagination } from "@/components/pagination"
import { CreateTagDialog } from "@/components/tag/create-tag-dialog"
import { TagItem } from "@/components/tag/tag-item"
import { UpdateTagDialog } from "@/components/tag/update-tag-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TGetTagResponse } from "@/types/tags"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type TQueryOptions = {
  title: string
  page: number
  limit: number
}

export default function TagsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TGetTagResponse | null>(null)
  const [queryParams, setQueryParams] = useState<TQueryOptions>({
    title: "",
    page: 1,
    limit: 5,
  })

  function onEdit(tag: TGetTagResponse): void {
    setSelectedTag(tag)
    setOpenUpdateDialog(true)
  }

  function setQuery(value: Partial<TQueryOptions>): void {
    setQueryParams((prev) => {
      const finalQuery = { ...prev, ...value }

      if (value.page === undefined) {
        finalQuery.page = 1
      }

      return finalQuery
    })
  }

  const { data, isLoading, isError, error } = useQuery<
    ApiResponse<TGetTagResponse[]>
  >({
    queryKey: ["tags", queryParams],
    queryFn: async () => {
      const response = await fetchData<TGetTagResponse[]>({
        url: "/tags",
        queryParams,
      })

      if (!response.data || !response.meta) {
        throw new Error("Something went wrong!")
      }

      return response
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(handleErrorMessage(error))
    }
  }, [isError, error])

  const tags = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader pageName="Tags" pageDescription="Manage your tag.">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setSelectedTag(null)
              setOpenCreateDialog(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </PageHeader>
      <Input
        placeholder="Search tags..."
        type="search"
        onChange={(e) => setQuery({ title: e.target.value })}
      />
      <ItemGroup className="gap-3 pt-5">
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Loading tags...
          </div>
        ) : tags.length > 0 ? (
          tags.map((tag) => (
            <TagItem key={tag.id} {...tag} onEdit={() => onEdit(tag)} />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            No tags found.
          </div>
        )}

        {meta && (
          <CommonPagination
            {...meta}
            onPageChange={(page) => setQuery({ page })}
          />
        )}
      </ItemGroup>
      <CreateTagDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <UpdateTagDialog
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        tagId={selectedTag?.id}
      />
    </div>
  )
}
