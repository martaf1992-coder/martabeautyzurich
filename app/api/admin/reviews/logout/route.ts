import { NextRequest, NextResponse } from 'next/server'
import {
  adminSessionFromRequest,
  clearAdminSessionCookie,
  hasValidCsrf,
  isSameOriginRequest,
} from '@/lib/reviewAdminAuth'

export async function POST(request: NextRequest) {
  const session = adminSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }
  if (!isSameOriginRequest(request) || !hasValidCsrf(request, session)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  const response = NextResponse.json({ authenticated: false })
  clearAdminSessionCookie(response)
  return response
}
