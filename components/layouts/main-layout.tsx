"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import { useAuth } from "@/hooks/use-auth"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
