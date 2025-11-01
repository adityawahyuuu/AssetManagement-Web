"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import AuthLayout from "@/components/layouts/auth-layout"
import { toast } from "sonner"

export default function VerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const verificationEmail = localStorage.getItem("verificationEmail")
    if (!verificationEmail) {
      router.push("/register")
      return
    }
    setEmail(verificationEmail)
  }, [router])

  const handleOpenEmail = () => {
    const mailtoLink = `mailto:${email}`
    window.location.href = mailtoLink
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!otp.trim()) {
        throw new Error("Please enter the OTP code")
      }

      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Verification failed")
      }

      const data = await response.json()

      // Store token if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }

      setSuccess(true)
      toast.success("Email verified successfully!")

      // Redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("verificationEmail")
        router.push("/login")
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)

    try {
      const response = await fetch("/api/user/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to resend OTP")
      }

      toast.success("A new OTP code has been sent to your email!")
      setOtp("") // Clear the OTP input field
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("An unexpected error occurred while resending OTP")
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout showFooter={!success}>
      <Card className="w-full max-w-md shadow-xl border-slate-200 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Congratulations!</CardTitle>
          <CardDescription className="text-slate-600">
            Your account has been created successfully. Please verify your email to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {success ? (
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              <p className="text-slate-900 font-medium">Email verified successfully!</p>
              <p className="text-slate-600 text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-900 text-sm">
                  A verification code has been sent to <strong>{email}</strong>
                </p>
              </div>

              <Button
                type="button"
                onClick={handleOpenEmail}
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Open Email Client
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or enter code manually</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                    Enter OTP Code
                  </label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading}
                    maxLength={6}
                    className="border-slate-200 focus:border-primary focus:ring-primary text-center text-lg tracking-widest"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || isLoading}
                  className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Resending..." : "Resend code"}
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
