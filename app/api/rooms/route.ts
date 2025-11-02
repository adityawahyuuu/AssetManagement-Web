import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7146'

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

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    // Proxy request to backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/rooms?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch rooms' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json()

    // Proxy request to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}