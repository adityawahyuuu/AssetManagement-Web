"use client"

import type { ReactNode } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import { useAuth } from "@/hooks/use-auth"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth()

  // Trust the middleware for authentication - it will redirect if needed
  // We only use useAuth for fetching user data and displaying it

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto pl-64">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
