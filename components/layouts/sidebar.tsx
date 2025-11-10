"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, DoorOpen, BarChart3, Settings, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

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

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform duration-300 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:!translate-x-0 md:z-auto md:top-auto md:left-auto
        `}
      >
        {/* Close Button on Mobile */}
        <div className="flex items-center justify-between border-b border-border p-4 md:hidden shrink-0">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button at Bottom - Fixed */}
        <div className="border-t border-border p-4 shrink-0">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
