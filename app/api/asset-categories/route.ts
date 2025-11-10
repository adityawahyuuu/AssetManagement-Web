import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

export async function GET(request: NextRequest) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    const response = await proxyToBackend(
      BACKEND_API_URL,
      BACKEND_ENDPOINTS.ASSET_CATEGORIES,
      'GET',
      token!
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch asset categories' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleApiError(error, 'Get asset categories')
  }
}
