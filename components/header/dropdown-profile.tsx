"use client"

import { ListTodo, LogOutIcon, Menu, Tag } from "lucide-react"

import { removeTokens } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "../auth-provider"
import { Button } from "../ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar"

type Props = {
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

function HamburgerMenu({ defaultOpen, align = "end" }: Props) {
  const { user, setUser } = useAuth()

  async function onLogout() {
    await removeTokens()
    setUser()
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9.5">
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align={align}>
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
        <DropdownMenuItem asChild className="px-4 py-2.5 text-base">
          <Link href="/" className="flex items-center gap-2">
            <ListTodo className="size-5" />
            <span>Task Management</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="px-4 py-2.5 text-base">
          <Link href="/tags" className="flex items-center gap-2">
            <Tag className="size-5" />
            <span>Tag Management</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          asChild
          variant="destructive"
          className="px-4 py-2.5 text-base"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2"
            onClick={onLogout}
          >
            <LogOutIcon className="size-5" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HamburgerMenu
