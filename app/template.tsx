"use client"

import { useAuth } from "@/components/auth-provider"
import ProfileDropdown from "@/components/header/dropdown-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

export default function RootTemplate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return (
    <div className="flex min-h-dvh w-full">
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b bg-card">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-4">
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList className="flex items-center gap-2">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
                      href="/"
                    >
                      Todo
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="text-muted-foreground/50">
                    <span className="text-xl">/</span>
                  </BreadcrumbSeparator>

                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
                      href="/tags"
                    >
                      Tag
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-1.5">
              {user && (
                <ProfileDropdown
                  trigger={
                    <Button variant="ghost" size="icon" className="size-9.5">
                      {user && (
                        <Avatar className="size-9.5 rounded-md">
                          <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                      )}
                    </Button>
                  }
                />
              )}
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
