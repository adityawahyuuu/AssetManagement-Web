"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import Footer from "./footer"

interface AuthLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  const { isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/dashboard"
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
