"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MainLayout from "@/components/layouts/main-layout"

export default function AuthDiagnosticPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const diagnostics: any = {}

    try {
      // 1. Check localStorage
      diagnostics.localStorage = {
        hasToken: !!localStorage.getItem('authToken'),
        tokenLength: localStorage.getItem('authToken')?.length || 0,
        tokenPreview: localStorage.getItem('authToken')?.substring(0, 50) + '...',
        hasExpiration: !!localStorage.getItem('authTokenExpiration'),
        expirationTime: localStorage.getItem('authTokenExpiration'),
        isExpired: false,
        hasUser: !!localStorage.getItem('user'),
        user: null as any
      }

      // Check expiration
      const expiration = localStorage.getItem('authTokenExpiration')
      if (expiration) {
        const expirationTime = new Date(parseInt(expiration))
        const now = new Date()
        diagnostics.localStorage.isExpired = now > expirationTime
        diagnostics.localStorage.expirationDate = expirationTime.toLocaleString()
        diagnostics.localStorage.minutesUntilExpiration = Math.round((expirationTime.getTime() - now.getTime()) / 60000)
      }

      // Parse user
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          diagnostics.localStorage.user = JSON.parse(userStr)
        } catch (e) {
          diagnostics.localStorage.userParseError = 'Failed to parse user data'
        }
      }

      // 2. Test auth header endpoint
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const testAuthResponse = await fetch('/api/test-auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          diagnostics.testAuth = await testAuthResponse.json()
        } catch (e) {
          diagnostics.testAuth = { error: 'Failed to call test-auth endpoint' }
        }

        // 3. Try to get current user
        try {
          const meResponse = await fetch('/api/user/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          diagnostics.currentUser = {
            status: meResponse.status,
            statusText: meResponse.statusText,
            ok: meResponse.ok,
            data: await meResponse.json()
          }
        } catch (e) {
          diagnostics.currentUser = { error: String(e) }
        }

        // 4. Try to list rooms
        try {
          const roomsResponse = await fetch('/api/rooms', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          diagnostics.getRooms = {
            status: roomsResponse.status,
            statusText: roomsResponse.statusText,
            ok: roomsResponse.ok,
            headers: Object.fromEntries(roomsResponse.headers.entries()),
            data: await roomsResponse.json()
          }
        } catch (e) {
          diagnostics.getRooms = { error: String(e) }
        }

        // 5. Decode JWT (client-side, just for info)
        try {
          const parts = token.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]))
            diagnostics.jwt = {
              header: JSON.parse(atob(parts[0])),
              payload: payload,
              expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
              issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown',
              subject: payload.sub || 'No subject',
              claims: payload
            }
          }
        } catch (e) {
          diagnostics.jwt = { error: 'Failed to decode JWT' }
        }
      } else {
        diagnostics.error = 'No token found in localStorage'
      }

      setResults(diagnostics)
    } catch (error) {
      setResults({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This page helps diagnose authentication issues by checking your token and testing API endpoints.
            </p>
            <Button onClick={runDiagnostics} disabled={loading}>
              {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-4">
            {/* localStorage Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. LocalStorage Check</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.localStorage, null, 2)}
                </pre>
                {results.localStorage?.isExpired && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 font-semibold">⚠️ Token is EXPIRED!</p>
                    <p className="text-sm text-red-600">Please login again to get a fresh token.</p>
                  </div>
                )}
                {results.localStorage?.minutesUntilExpiration < 2 && !results.localStorage?.isExpired && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 font-semibold">⚠️ Token expires soon!</p>
                    <p className="text-sm text-yellow-600">
                      Expires in {results.localStorage.minutesUntilExpiration} minute(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* JWT Decode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. JWT Token Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.jwt, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Test Auth Endpoint */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Test Auth Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.testAuth, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Current User */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Get Current User (/api/user/auth/me)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.currentUser, null, 2)}
                </pre>
                {results.currentUser?.status === 401 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 font-semibold">⚠️ Backend returned 401 Unauthorized</p>
                    <p className="text-sm text-red-600">The backend is rejecting your token.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Get Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Get Rooms (/api/rooms)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.getRooms, null, 2)}
                </pre>
                {results.getRooms?.status === 401 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 font-semibold">⚠️ Backend returned 401 Unauthorized</p>
                    <p className="text-sm text-red-600">The backend is rejecting your token for rooms endpoint.</p>
                    {results.getRooms?.headers?.['www-authenticate'] && (
                      <p className="text-sm text-red-600 mt-1">
                        WWW-Authenticate: {results.getRooms.headers['www-authenticate']}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {results.localStorage?.isExpired && (
                  <p className="text-blue-800">
                    ✓ <strong>Action Required:</strong> Login again to get a fresh token
                  </p>
                )}
                {results.currentUser?.status === 401 && (
                  <>
                    <p className="text-blue-800">
                      ✓ <strong>Backend Issue:</strong> Your backend API is rejecting the token
                    </p>
                    <p className="text-blue-800">
                      ✓ Check backend JWT configuration (secret key, issuer, audience)
                    </p>
                    <p className="text-blue-800">
                      ✓ Verify backend expects "Bearer" authentication scheme
                    </p>
                    <p className="text-blue-800">
                      ✓ Check backend authentication middleware is properly configured
                    </p>
                  </>
                )}
                {!results.localStorage?.hasToken && (
                  <p className="text-blue-800">
                    ✓ <strong>No Token:</strong> Please login first
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
