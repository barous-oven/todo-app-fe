import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value ?? null

  if (!accessToken) redirect("/login")

  return <>{children}</>
}
