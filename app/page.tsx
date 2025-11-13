"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Force dynamic rendering to avoid static generation errors with localStorage
export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken")

    if (authToken) {
      // User is logged in, redirect to dashboard
      router.push("/dashboard")
    } else {
      // User is not logged in, redirect to login
      router.push("/login")
    }
  }, [router])

  // Show loading state while checking auth and redirecting
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading...</p>
      </div>
    </main>
  )
}
