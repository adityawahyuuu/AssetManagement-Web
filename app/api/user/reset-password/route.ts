import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otpCode, password, passwordConfirm } = body

    // Validate required fields
    if (!email || !otpCode || !password || !passwordConfirm) {
      return NextResponse.json(
        { message: 'All fields are required' },
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
    formData.append('otpCode', otpCode)
    formData.append('password', password)
    formData.append('passwordConfirm', passwordConfirm)

    console.log('Calling backend:', `${BACKEND_API_URL}/api/user/reset-password`)

    const response = await fetch(`${BACKEND_API_URL}/api/user/reset-password`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to reset password' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        message: data.message || 'Password has been reset successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
