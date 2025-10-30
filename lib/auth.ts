// Authentication helper functions
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("authToken", token)
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("authToken")
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
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

export function logout(): void {
  clearUserSession()
}
