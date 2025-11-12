import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, BACKEND_ENDPOINTS } from '@/lib/constants'
import { extractAuthToken, handleApiError, proxyToBackend } from '@/lib/api-helpers'

const BACKEND_API_URL = API_CONFIG.BASE_URL

export async function GET(request: NextRequest) {
  try {
    const { token, error } = extractAuthToken(request)
    if (error) return error

    // If backend API is configured, proxy the request
    if (BACKEND_API_URL) {
      try {
        console.log('Calling backend:', `${BACKEND_API_URL}${BACKEND_ENDPOINTS.USER.ME}`)

        const response = await proxyToBackend(
          BACKEND_API_URL,
          BACKEND_ENDPOINTS.USER.ME,
          'GET',
          token!
        )

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { message: data.message || 'Failed to fetch user data' },
            { status: response.status }
          )
        }

        return NextResponse.json(
          {
            user: data.data || data.user || data,
          },
          { status: 200 }
        )
      } catch (backendError) {
        console.error('Backend fetch error:', backendError)
        // If backend fails, return a minimal response
        return NextResponse.json(
          {
            user: {
              authenticated: true,
            },
          },
          { status: 200 }
        )
      }
    }

    // If no backend configured, return minimal user data
    return NextResponse.json(
      {
        user: {
          authenticated: true,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error, 'Get auth user')
  }
}
