import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Children } from "react"

export type TPageProps = {
  pageName: string
  pageDescription: string
  children?: React.ReactNode
}

export function PageHeader(props: TPageProps) {
  const { pageName, pageDescription, children } = props
  return (
    <header className="mb-8 flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{pageName}</h1>
        <p className="text-sm text-muted-foreground">{pageDescription}</p>
      </div>
      {children}
    </header>
  )
}
