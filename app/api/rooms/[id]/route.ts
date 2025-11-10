import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ROOMS.BY_ID(params.id),
      'GET',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Get room')
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const body = await request.json()

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ROOMS.BY_ID(params.id),
      'PUT',
      token!,
      body
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Update room')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ROOMS.BY_ID(params.id),
      'DELETE',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to delete room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Delete room')
  }
}
