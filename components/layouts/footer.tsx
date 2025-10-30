export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">© {currentYear} Dorm Asset Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
