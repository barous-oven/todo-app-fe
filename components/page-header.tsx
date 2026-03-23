import { Plus } from "lucide-react"
import { Button } from "./ui/button"

export type TPageProps = {
  pageName: string
  pageDescription: string
  onCreateClick?: () => void
}

export function PageHeader(props: TPageProps) {
  return (
    <header className="mb-8 flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{props.pageName}</h1>
        <p className="text-sm text-muted-foreground">{props.pageDescription}</p>
      </div>

      <Button size="sm" className="gap-2" onClick={props.onCreateClick}>
        <Plus className="h-4 w-4" />
        New
      </Button>
    </header>
  )
}
