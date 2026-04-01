"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search, Tags } from "lucide-react"
import { toast } from "sonner"

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
      const next = { ...prev, ...value }

      if (value.page === undefined) {
        next.page = 1
      }

      return next
    })
  }

  const { data, isLoading, isFetching, isError, error } = useQuery<
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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        pageName="Tags"
        pageDescription="Organize your tasks with clean and reusable tags."
      >
        <Button
          className="h-9 gap-2 rounded-lg px-4"
          onClick={() => {
            setSelectedTag(null)
            setOpenCreateDialog(true)
          }}
        >
          <Plus className="size-4" />
          New tag
        </Button>
      </PageHeader>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tags by title..."
            value={queryParams.title}
            onChange={(e) => setQuery({ title: e.target.value })}
            className="h-10 rounded-lg pl-9"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Tag list</h2>
            <p className="text-sm text-muted-foreground">
              {isFetching ? "Updating..." : `${tags.length} tag(s) shown`}
            </p>
          </div>
        </div>

        <ItemGroup className="gap-3">
          {isLoading ? (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-4 text-center">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                <Tags className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Loading tags...</p>
              <p className="text-sm text-muted-foreground">
                Please wait a moment.
              </p>
            </div>
          ) : tags.length > 0 ? (
            tags.map((tag) => (
              <TagItem key={tag.id} {...tag} onEdit={() => onEdit(tag)} />
            ))
          ) : (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-4 text-center">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                <Tags className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No tags found</p>
              <p className="text-sm text-muted-foreground">
                Try changing your search or create a new tag.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-lg"
                onClick={() => {
                  setSelectedTag(null)
                  setOpenCreateDialog(true)
                }}
              >
                <Plus className="mr-2 size-4" />
                Create tag
              </Button>
            </div>
          )}

          {meta && (
            <div className="pt-2">
              <CommonPagination
                {...meta}
                onPageChange={(page) => setQuery({ page })}
              />
            </div>
          )}
        </ItemGroup>
      </div>

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
