"use client"

import { useState, useEffect, useCallback } from "react"
import { getAuthToken, isAuthenticated as checkIsAuthenticated } from "@/lib/auth"
import { getCurrentUser } from "@/lib/api"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(() => {
    const authToken = getAuthToken()
    const authenticated = checkIsAuthenticated()

    setToken(authToken)
    setIsAuth(authenticated)
    setIsAuthenticated(authenticated)

    // Set loading to false immediately so dashboard can render
    // The middleware is the source of truth for authentication
    setIsLoading(false)

    if (authenticated) {
      // Try to get user data from API
      getCurrentUser()
        .then((response: any) => {
          // Extract user data from response
          const userData = response?.user || response?.data || response
          setUser(userData)
        })
        .catch((error) => {
          // If API fails, fall back to localStorage
          console.warn("Could not fetch user data from API:", error)
          const userSession = typeof window !== "undefined" ? localStorage.getItem("user") : null
          if (userSession) {
            try {
              setUser(JSON.parse(userSession))
            } catch {
              setUser(null)
            }
          } else {
            setUser(null)
          }
        })
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    // Initial check
    checkAuth()

    // Listen for storage changes (e.g., login from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "authTokenExpiration") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [checkAuth])

  return { token, isAuth, isAuthenticated, user, isLoading }
}
