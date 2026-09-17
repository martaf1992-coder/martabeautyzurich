import { NextRequest, NextResponse } from 'next/server'
import {
  adminAuthIsConfigured,
  createAdminSession,
  isSameOriginRequest,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from '@/lib/reviewAdminAuth'

export const dynamic = 'force-dynamic'

const attempts = new Map<string, { count: number; resetAt: number }>()
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

function clientKey(request: NextRequest) {
  return request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
}

function isRateLimited(key: string) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > MAX_ATTEMPTS
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!adminAuthIsConfigured()) {
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 503 })
  }

  const key = clientKey(request)
  if (isRateLimited(key)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!verifyAdminCredentials(String(body?.username ?? ''), String(body?.password ?? ''))) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
  }

  attempts.delete(key)
  const { token, payload } = createAdminSession()
  const response = NextResponse.json({ authenticated: true, csrfToken: payload.csrf })
  setAdminSessionCookie(response, token)
  return response
}
