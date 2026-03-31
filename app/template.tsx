"use client"

import { useAuth } from "@/components/auth-provider"
import HamburgerMenu from "@/components/header/dropdown-profile"
import { ReactNode } from "react"

export default function RootTemplate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return (
    <div className="flex min-h-dvh w-full">
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b bg-card">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-4">
              <h1>TODO</h1>
            </div>
            <div className="flex items-center gap-1.5">
              {user && <HamburgerMenu />}
            </div>
          </div>
        </header>
        <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
