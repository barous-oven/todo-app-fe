"use client"

import { ApiResponse, fetchData } from "@/lib/fetch-data"
import handleErrorMessage from "@/lib/handle-error-message"
import { TMeResponseDto } from "@/types/me"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useState } from "react"
import { toast } from "sonner"

type AuthContextType = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  user?: TMeResponseDto
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialAccessToken,
  initialUser,
}: {
  children: React.ReactNode
  initialAccessToken: string | null
  initialUser: TMeResponseDto | undefined
}) {
  const [accessToken, setAccessToken] = useState(initialAccessToken)

  const { data, isError, error } = useQuery<ApiResponse<TMeResponseDto>>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetchData<TMeResponseDto>({
        url: "/auth/me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.data) {
        throw new Error("Something went wrong!")
      }

      return response
    },
    enabled: !!accessToken,
  })

  if (isError) {
    toast.error(handleErrorMessage(error))
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user: data?.data || initialUser }}
    >
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
