"use client"

import { useState, useEffect } from "react"
import { getAuthToken, isAuthenticated as checkIsAuthenticated } from "@/lib/auth"
import { getCurrentUser } from "@/lib/api"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authToken = getAuthToken()
    const authenticated = checkIsAuthenticated()
    setToken(authToken)
    setIsAuth(authenticated)
    setIsAuthenticated(authenticated)

    if (authenticated) {
      getCurrentUser()
        .then((userData) => setUser(userData))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  return { token, isAuth, isAuthenticated, user, isLoading }
}
