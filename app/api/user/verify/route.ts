import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7146'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Create FormData
    const formData = new FormData()
    formData.append('Email', email)
    formData.append('OtpCode', otp)

    const response = await fetch(`${BACKEND_API_URL}/api/user/verify`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Verification failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { 
        message: data.message,
        token: data.token,
        user: data.data.email 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}