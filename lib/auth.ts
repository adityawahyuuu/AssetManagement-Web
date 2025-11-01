// Authentication helper functions
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("authToken", token)
}

export function setAuthTokenWithExpiration(token: string, expirationMinutes: number): void {
  if (typeof window === "undefined") return

  // Set the token
  localStorage.setItem("authToken", token)

  // Calculate expiration timestamp (current time + expirationMinutes)
  const expirationTime = new Date().getTime() + (expirationMinutes * 60 * 1000)
  localStorage.setItem("authTokenExpiration", expirationTime.toString())
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("authToken")
  localStorage.removeItem("authTokenExpiration")
}

export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true

  const expirationTime = localStorage.getItem("authTokenExpiration")
  if (!expirationTime) return true

  const currentTime = new Date().getTime()
  return currentTime > parseInt(expirationTime)
}

export function getSessionExpiration(): Date | null {
  if (typeof window === "undefined") return null

  const expirationTime = localStorage.getItem("authTokenExpiration")
  if (!expirationTime) return null

  return new Date(parseInt(expirationTime))
}

export function refreshSession(): void {
  if (typeof window === "undefined") return

  const token = getAuthToken()
  if (token && !isTokenExpired()) {
    // Reset expiration to 10 minutes from now
    const expirationTime = new Date().getTime() + (10 * 60 * 1000)
    localStorage.setItem("authTokenExpiration", expirationTime.toString())
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  if (!token) return false

  // Check if token is expired
  if (isTokenExpired()) {
    // Clear expired session
    removeAuthToken()
    clearUserSession()
    return false
  }

  return true
}

export function setUserSession(user: any): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
}

export function getUserSession(): any {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
  removeAuthToken()
}

export async function logout(): Promise<void> {
  // Call logout API to clear server-side cookie
  try {
    await fetch('/api/user/logout', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Logout API error:', error)
  }

  // Clear client-side session
  clearUserSession()
}
