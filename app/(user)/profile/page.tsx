"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { Mail, User, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      alert("Profile update functionality to be implemented")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile")
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="Profile"
        description="Manage your account information"
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
                {user?.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "U"}
              </div>
              <div>
                <p className="font-semibold text-lg">{user?.fullName || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:bg-muted"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:bg-muted"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:bg-muted"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      if (user) {
                        setFormData({
                          fullName: user.fullName || "",
                          email: user.email || "",
                          username: user.username || "",
                        })
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Verified</p>
                <p className="text-sm text-muted-foreground">Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
