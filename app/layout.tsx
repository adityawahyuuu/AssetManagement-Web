import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

// Mark as dynamic for development - prevents static pre-rendering issues
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Dorm Asset Management",
  description: "Manage and track dorm assets efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  )
}
