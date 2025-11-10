import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants'

const BACKEND_API_URL = API_CONFIG.BASE_URL

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

    console.log('Calling backend:', `${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.RESEND_OTP}`)

    const response = await fetch(`${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.RESEND_OTP}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to resend OTP' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        message: data.message || 'OTP sent successfully',
        expirationMinutes: data.data?.expirationMinutes
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
