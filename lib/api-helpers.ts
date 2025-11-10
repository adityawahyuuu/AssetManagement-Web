/**
 * API Route Helpers
 *
 * Common utilities for Next.js API routes to reduce code duplication
 */

import { NextRequest, NextResponse } from 'next/server'
import { HTTP_CONFIG, ERROR_MESSAGES, AUTH_CONFIG } from '@/lib/constants'

/**
 * Extract and validate Bearer token from request headers or cookies
 * First checks Authorization header, then falls back to auth cookie
 */
export function extractAuthToken(request: NextRequest): { token: string | null; error: NextResponse | null } {
  let token: string | null = null

  // Try to get token from Authorization header first
  const authHeader = request.headers.get(HTTP_CONFIG.HEADERS.AUTHORIZATION)
  if (authHeader && authHeader.startsWith(HTTP_CONFIG.HEADERS.BEARER_PREFIX)) {
    token = authHeader.substring(HTTP_CONFIG.HEADERS.BEARER_PREFIX.length)
  }

  // Fallback to cookie if no header token
  if (!token) {
    token = request.cookies.get(AUTH_CONFIG.COOKIE.NAME)?.value || null
  }

  if (!token) {
    return {
      token: null,
      error: NextResponse.json(
        { message: ERROR_MESSAGES.AUTH.NO_TOKEN },
        { status: 401 }
      ),
    }
  }

  return { token, error: null }
}

/**
 * Create headers for proxying requests to backend API
 */
export function createProxyHeaders(token: string): HeadersInit {
  return {
    [HTTP_CONFIG.HEADERS.AUTHORIZATION]: `${HTTP_CONFIG.HEADERS.BEARER_PREFIX}${token}`,
    [HTTP_CONFIG.HEADERS.CONTENT_TYPE]: HTTP_CONFIG.CONTENT_TYPES.JSON,
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`${context} error:`, error)
  return NextResponse.json(
    { message: error instanceof Error ? error.message : ERROR_MESSAGES.API.INTERNAL_ERROR },
    { status: 500 }
  )
}

/**
 * Proxy a request to the backend API
 */
export async function proxyToBackend(
  backendUrl: string,
  endpoint: string,
  method: string,
  token: string,
  body?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: createProxyHeaders(token),
  }

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body)
  }

  return fetch(`${backendUrl}${endpoint}`, options)
}
