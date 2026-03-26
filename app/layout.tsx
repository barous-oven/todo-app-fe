import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { cookies } from "next/headers"
import { Toaster } from "sonner"

import { AuthProvider } from "@/components/auth-provider"
import QueryProvider from "@/providers/query-provider"
import { TMeResponseDto } from "@/types/me"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value ?? ""

  let user: TMeResponseDto | undefined = undefined

  if (accessToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Something went wrong!")
      }

      const jsonData = await response.json()

      user = jsonData.data
    } catch {
      user = undefined
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <QueryProvider>
          <AuthProvider initialAccessToken={accessToken} initialUser={user}>
            <ThemeProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={3000}
              />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
