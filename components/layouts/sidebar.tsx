"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, DoorOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Assets",
    href: "/assets",
    icon: Package,
  },
  {
    label: "Rooms",
    href: "/rooms",
    icon: DoorOpen,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
