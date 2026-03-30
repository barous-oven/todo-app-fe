import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

import { AuthProvider } from "@/components/auth-provider"
import QueryProvider from "@/providers/query-provider"

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
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={false}
              duration={3000}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
