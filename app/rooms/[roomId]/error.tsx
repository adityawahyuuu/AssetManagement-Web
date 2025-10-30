"use client"

export default function RoomDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted mb-4">{error.message}</p>
        <button onClick={() => reset()} className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary">
          Try again
        </button>
      </div>
    </div>
  )
}
