import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL

    if (!BACKEND_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return NextResponse.json(
        { message: 'Server configuration error: API URL not defined' },
        { status: 500 }
      )
    }

    // Create FormData
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    console.log('Calling backend:', `${BACKEND_API_URL}/api/user/login`)

    const response = await fetch(`${BACKEND_API_URL}/api/user/login`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      )
    }

    // Create response with cookie
    const responseResult = NextResponse.json(
      {
        message: data.message || 'Login successful',
        token: data.token,
        user: data.data || data.user,
      },
      { status: 200 }
    )

    // Set auth token in cookie (10 minutes expiration)
    if (data.token) {
      responseResult.cookies.set('authToken', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60, // 10 minutes in seconds
        path: '/',
      })
    }

    return responseResult
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
