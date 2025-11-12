'use client'

import { useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
        <p className="text-slate-600 mb-6">An error occurred while processing your request.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
