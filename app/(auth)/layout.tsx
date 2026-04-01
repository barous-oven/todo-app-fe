import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")

  if (accessToken) {
    redirect("/")
  }
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
