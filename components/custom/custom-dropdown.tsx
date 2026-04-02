import { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export type CustomDropDownProps = {
  trigger: ReactNode
  label: string
  children: ReactNode
}

export function CustomDropDown({
  trigger,
  label,
  children,
}: CustomDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-md p-2 font-bold">
            {label}
          </DropdownMenuLabel>
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
