import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    // Extract token
    const token = authHeader.substring(7)

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL

    // If backend API is configured, proxy the request
    if (BACKEND_API_URL) {
      try {
        console.log('Calling backend:', `${BACKEND_API_URL}/api/user/auth/me`)

        const response = await fetch(`${BACKEND_API_URL}/api/user/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { message: data.message || 'Failed to fetch user data' },
            { status: response.status }
          )
        }

        return NextResponse.json(
          {
            user: data.data || data.user || data,
          },
          { status: 200 }
        )
      } catch (backendError) {
        console.error('Backend fetch error:', backendError)
        // If backend fails, return a minimal response
        return NextResponse.json(
          {
            user: {
              authenticated: true,
            },
          },
          { status: 200 }
        )
      }
    }

    // If no backend configured, return minimal user data
    return NextResponse.json(
      {
        user: {
          authenticated: true,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
