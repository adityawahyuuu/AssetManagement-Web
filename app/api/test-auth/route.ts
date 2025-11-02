import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.substring(7)

  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    authHeaderValue: authHeader ? `${authHeader.substring(0, 20)}...` : null,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    allHeaders: Object.fromEntries(request.headers.entries()),
  })
}
