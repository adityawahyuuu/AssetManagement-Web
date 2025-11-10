"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginSchema } from "@/lib/schemas"
import type { LoginFormData } from "@/types/user"
import Link from "next/link"
import AuthLayout from "@/components/layouts/auth-layout"
import { toast } from "sonner"
import { setAuthTokenWithExpiration, setUserSession } from "@/lib/auth"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("Login form submitted")

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData)
      console.log("Form validation passed")

      // Call login API
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      console.log("Login successful, received data:", data)

      // Store auth token with 10-minute expiration
      if (data.token) {
        setAuthTokenWithExpiration(data.token, 10)
        console.log("Token saved with expiration")
      }

      // Store user data if available
      if (data.user) {
        setUserSession(data.user)
        console.log("User session saved")
      }

      // Immediate redirect to dashboard with hard navigation
      console.log("Redirecting to dashboard...")
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Login error:", err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl border-slate-200 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-2 bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-2xl text-slate-900">Sign In</CardTitle>
          <CardDescription className="text-slate-600">Login to access your dorm asset management</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="border-slate-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
