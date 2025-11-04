"use client"

import { useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Eye, ToggleRight } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    darkMode: false,
    privateProfile: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement settings save API call
      alert("Settings updated successfully (functionality to be implemented)")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    }
  }

  return (
    <MainLayout>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="max-w-2xl space-y-6">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your assets and rooms
                </p>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
              <button
                onClick={() => handleToggle("pushNotifications")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.pushNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.pushNotifications ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleToggle("twoFactorAuth")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.twoFactorAuth ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.twoFactorAuth ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Private Profile</p>
                <p className="text-sm text-muted-foreground">
                  Keep your profile information private
                </p>
              </div>
              <button
                onClick={() => handleToggle("privateProfile")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.privateProfile ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.privateProfile ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ToggleRight className="h-5 w-5" />
              Display
            </CardTitle>
            <CardDescription>Customize your viewing experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the application
                </p>
              </div>
              <button
                onClick={() => handleToggle("darkMode")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.darkMode ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </MainLayout>
  )
}
