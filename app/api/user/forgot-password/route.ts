import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
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

    console.log('Calling backend:', `${BACKEND_API_URL}/api/user/forgot-password`)

    const response = await fetch(`${BACKEND_API_URL}/api/user/forgot-password`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to send password reset email' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        message: data.message || 'Password reset link has been sent to your email',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
