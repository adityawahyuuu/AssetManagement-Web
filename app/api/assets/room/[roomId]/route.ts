import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

// Mark as dynamic - this route requires request headers for authentication
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ASSETS.BY_ROOM(params.roomId),
      'GET',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch assets by room' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Get assets by room')
  }
}
