import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS, AUTH_CONFIG, ERROR_MESSAGES } from '@/lib/constants'

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

    const BACKEND_API_URL = API_CONFIG.BASE_URL

    if (!BACKEND_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return NextResponse.json(
        { message: ERROR_MESSAGES.API.CONFIG_ERROR },
        { status: 500 }
      )
    }

    // Create FormData
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    console.log('Calling backend:', `${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.LOGIN}`)

    const response = await fetch(`${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.LOGIN}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || ERROR_MESSAGES.AUTH.LOGIN_FAILED },
        { status: response.status }
      )
    }

    // Create response with cookie and token in body for client-side storage
    const responseResult = NextResponse.json(
      {
        message: data.message || 'Login successful',
        token: data.data?.token,
        user: data.data,
        // Note: Client should store this token in localStorage for Authorization header
        // The httpOnly cookie is automatically sent by the browser for cookie-based auth
      },
      { status: 200 }
    )

    // Set auth token in httpOnly cookie with configured expiration (most secure)
    if (data.data?.token) {
      responseResult.cookies.set(AUTH_CONFIG.COOKIE.NAME, data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: AUTH_CONFIG.COOKIE.SAME_SITE,
        maxAge: AUTH_CONFIG.COOKIE.MAX_AGE_SECONDS,
        path: AUTH_CONFIG.COOKIE.PATH,
      })
    }

    return responseResult
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : ERROR_MESSAGES.API.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
