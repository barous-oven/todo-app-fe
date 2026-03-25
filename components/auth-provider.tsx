"use client"

import { createContext, useContext, useState } from "react"

type AuthContextType = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialAccessToken,
}: {
  children: React.ReactNode
  initialAccessToken: string | null
}) {
  const [accessToken, setAccessToken] = useState(initialAccessToken)

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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
