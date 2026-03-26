"use client"

import { getTokens } from "@/app/actions/auth"
import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TMeResponseDto } from "@/types/me"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

type AuthContextType = {
  user?: TMeResponseDto
  setUser: (user?: TMeResponseDto) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TMeResponseDto>()
  useQuery<ApiResponse<TMeResponseDto>>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetchData<TMeResponseDto>({
        url: "/auth/me",
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      setUser(response.data)
      return response
    },
  })

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
