import { NextRequest, NextResponse } from 'next/server'
import type { RegisterFormData } from '@/types/user'
import { API_CONFIG, BACKEND_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants'

const BACKEND_API_URL = API_CONFIG.BASE_URL

export async function POST(request: NextRequest) {
  try {
    const body: RegisterFormData = await request.json()

    if (!BACKEND_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return NextResponse.json(
        { message: ERROR_MESSAGES.API.CONFIG_ERROR },
        { status: 500 }
      )
    }

    // Create FormData
    const formData = new FormData()
    formData.append('email', body.email)
    formData.append('password', body.password)
    formData.append('passwordConfirm', body.confirmPassword)
    formData.append('username', body.username)

    console.log('Calling backend:', `${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.REGISTER}`)

    const response = await fetch(`${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.REGISTER}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { 
        message: 'Registration successful',
        email: data.data?.email || body.email,
        expirationMinutes: data.data?.expirationMinutes,
        token: data.token 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}