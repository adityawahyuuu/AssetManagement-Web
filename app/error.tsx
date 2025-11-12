'use client'

export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>Something went wrong!</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>An error occurred while processing your request.</p>
        <button
          onClick={() => reset()}
          style={{ padding: '8px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
