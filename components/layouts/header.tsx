"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { logout } from "@/lib/auth"

export default function Header() {
  const router = useRouter()
  const { user, isAuth, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-bold">DA</span>
            </div>
            <span className="hidden sm:inline text-slate-900">Dorm Assets</span>
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="text-sm font-bold">DA</span>
          </div>
          <span className="hidden sm:inline text-slate-900">Dorm Assets</span>
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {isAuth && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="relative h-8 w-8 rounded-full hover:bg-slate-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.fullName || "User"} />
                    <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                      {user.fullName
                        ? user.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col gap-1 px-2 py-1.5">
                  <p className="text-sm font-medium text-slate-900">{user.fullName || "User"}</p>
                  <p className="text-xs text-slate-600">{user.email || "No email"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
