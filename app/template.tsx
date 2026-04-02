"use client"

import { ReactNode } from "react"
import { CheckSquare2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import HamburgerMenu from "@/components/header/hamburger-menu"

export default function RootTemplate({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-dvh bg-muted/30">
      <div className="mx-auto flex min-h-dvh w-full flex-col">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckSquare2 className="size-5" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-base font-semibold tracking-tight sm:text-lg">
                  TODO
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Manage your tasks clearly and efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && <HamburgerMenu />}
            </div>
          </div>
        </header>

        <main className="h-full flex-1 px-4 py-4">
          <div className="mx-auto h-full w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
