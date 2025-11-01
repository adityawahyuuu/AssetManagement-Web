import { NextRequest, NextResponse } from 'next/server'
import type { RegisterFormData } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterFormData = await request.json()

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
    formData.append('email', body.email)
    formData.append('password', body.password)
    formData.append('passwordConfirm', body.confirmPassword)
    formData.append('username', body.username)

    console.log('Calling backend:', `${BACKEND_API_URL}/api/user/register`)

    const response = await fetch(`${BACKEND_API_URL}/api/user/register`, {
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