import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS, PAGINATION } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

// Mark as dynamic - this route requires request headers for authentication
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE)
    const pageSize = searchParams.get('pageSize') || String(PAGINATION.DEFAULT_PAGE_SIZE)

    // Proxy request to backend API
    const response = await proxyToBackend(
      BACKEND_API_URL,
      `${BACKEND_ENDPOINTS.ROOMS.BASE}?page=${page}&pageSize=${pageSize}`,
      'GET',
      token!
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
    return handleApiError(error, 'Get rooms')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const body = await request.json()

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ROOMS.BASE,
      'POST',
      token!,
      body
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Create room')
  }
}
