import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5080'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Proxy request to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/assets/${params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Get asset error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const response = await fetch(`${BACKEND_API_URL}/api/assets/${params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Update asset error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Proxy request to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/assets/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to delete asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Delete asset error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
