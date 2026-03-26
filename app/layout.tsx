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
          <AuthProvider>
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
