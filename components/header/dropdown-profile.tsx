"use client"

import { LogOutIcon } from "lucide-react"
import type { ReactNode } from "react"

import { removeTokens } from "@/app/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../auth-provider"

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

function ProfileDropdown({ trigger, defaultOpen, align = "end" }: Props) {
  const { user, setUser } = useAuth()

  async function onLogout() {
    await removeTokens()
    setUser()
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2 ring-card" />
          </div>

          <div className="flex flex-1 flex-col items-start">
            <span className="text-lg font-semibold text-foreground">
              {user?.name ?? "John D"}
            </span>
            <span className="text-base text-muted-foreground">
              {user?.email ?? "email@example.com"}
            </span>
          </div>
        </DropdownMenuLabel>

        <form action={onLogout}>
          <DropdownMenuItem
            asChild
            variant="destructive"
            className="px-4 py-2.5 text-base"
          >
            <button type="submit" className="w-full">
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
