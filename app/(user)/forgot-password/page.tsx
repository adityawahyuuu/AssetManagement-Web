"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import AuthLayout from "@/components/layouts/auth-layout"
import { toast } from "sonner"
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"
import { resetPasswordSchema } from "@/lib/schemas"
import type { ResetPasswordFormData } from "@/lib/schemas"

type Step = 1 | 2 | 3 | 4

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: "",
    otpCode: "",
    password: "",
    passwordConfirm: "",
  })

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email.trim()) {
        throw new Error("Please enter your email address")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      const response = await fetch("/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send OTP")
      }

      toast.success("OTP code has been sent to your email!")
      setFormData((prev) => ({ ...prev, email }))
      setCurrentStep(2)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      const validatedData = resetPasswordSchema.parse(formData)

      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset password")
      }

      toast.success("Password has been reset successfully!")
      setCurrentStep(4)
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep >= step
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step}
          </div>
          {index < 3 && (
            <div
              className={`w-12 h-1 mx-1 transition-colors ${
                currentStep > step ? "bg-primary" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <AuthLayout showFooter={currentStep !== 4}>
      <Card className="w-full max-w-md shadow-xl border-slate-200 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          {renderStepIndicator()}

          <div className="flex justify-center">
            {currentStep === 1 && <Mail className="w-12 h-12 text-primary" />}
            {currentStep === 2 && <CheckCircle2 className="w-12 h-12 text-green-600" />}
            {currentStep === 3 && <KeyRound className="w-12 h-12 text-primary" />}
            {currentStep === 4 && <CheckCircle2 className="w-12 h-12 text-green-600" />}
          </div>

          <CardTitle className="text-2xl text-slate-900 text-center">
            {currentStep === 1 && "Reset Your Password"}
            {currentStep === 2 && "Check Your Email"}
            {currentStep === 3 && "Create New Password"}
            {currentStep === 4 && "Password Reset Complete"}
          </CardTitle>

          <CardDescription className="text-slate-600 text-center">
            {currentStep === 1 && "Enter your email address to receive an OTP code"}
            {currentStep === 2 && "We've sent a 6-digit OTP code to your email"}
            {currentStep === 3 && "Enter the OTP code and create your new password"}
            {currentStep === 4 && "Your password has been successfully reset"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Step 1: Enter Email */}
          {currentStep === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP Code"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Sent Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-900 text-sm">
                  A 6-digit OTP code has been sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <p>Please check your email inbox (and spam folder) for the OTP code.</p>
              </div>

              <Button
                onClick={() => setCurrentStep(3)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                I have the code, continue
              </Button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1)
                    setEmail("")
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Try another email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password Form */}
          {currentStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="border-slate-200 bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otpCode" className="text-sm font-medium text-slate-700">
                  OTP Code
                </label>
                <Input
                  id="otpCode"
                  name="otpCode"
                  type="text"
                  placeholder="000000"
                  value={formData.otpCode}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={6}
                  className="border-slate-200 focus:border-primary focus:ring-primary text-center text-lg tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-primary focus:ring-primary"
                />
                <p className="text-xs text-slate-500">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="passwordConfirm" className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-900 text-sm font-medium">
                  Your password has been successfully reset!
                </p>
              </div>

              <p className="text-sm text-slate-600 text-center">
                You can now login with your new password.
              </p>

              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
