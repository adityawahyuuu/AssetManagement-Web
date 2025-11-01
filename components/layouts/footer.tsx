export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200/50 backdrop-blur-sm bg-white/30 py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-600">© {currentYear} Dorm Asset Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
