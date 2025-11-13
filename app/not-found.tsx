export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">404</h2>
        <h3 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h3>
        <p className="text-slate-600 mb-6">The page you are looking for does not exist.</p>
        <a
          href="/"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition inline-block"
        >
          Go back home
        </a>
      </div>
    </div>
  )
}
