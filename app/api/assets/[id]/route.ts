import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

// Mark as dynamic - this route requires request headers for authentication
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ASSETS.BY_ID(params.id),
      'GET',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Get asset')
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
      BACKEND_ENDPOINTS.ASSETS.BY_ID(params.id),
      'PUT',
      token!,
      body
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Update asset')
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
      BACKEND_ENDPOINTS.ASSETS.BY_ID(params.id),
      'DELETE',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to delete asset' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Delete asset')
  }
}
