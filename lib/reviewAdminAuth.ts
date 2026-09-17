import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const REVIEW_ADMIN_COOKIE = 'review_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

type SessionPayload = {
  username: string
  csrf: string
  expiresAt: number
}

function sessionSecret() {
  const secret = process.env.REVIEW_ADMIN_SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

function signature(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function safelyEqual(left: string, right: string) {
  const leftHash = createHmac('sha256', 'review-admin-compare').update(left).digest()
  const rightHash = createHmac('sha256', 'review-admin-compare').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

export function adminAuthIsConfigured() {
  return Boolean(process.env.REVIEW_ADMIN_PASSWORD && sessionSecret())
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedPassword = process.env.REVIEW_ADMIN_PASSWORD
  const expectedUsername = process.env.REVIEW_ADMIN_USERNAME || 'marta'
  if (!expectedPassword || !sessionSecret()) return false
  return safelyEqual(username, expectedUsername) && safelyEqual(password, expectedPassword)
}

export function createAdminSession() {
  const secret = sessionSecret()
  if (!secret) throw new Error('Review admin session secret is not configured.')

  const payload: SessionPayload = {
    username: process.env.REVIEW_ADMIN_USERNAME || 'marta',
    csrf: randomBytes(24).toString('base64url'),
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return { token: `${encoded}.${signature(encoded, secret)}`, payload }
}

export function readAdminSession(token?: string): SessionPayload | null {
  const secret = sessionSecret()
  if (!secret || !token) return null
  const separator = token.lastIndexOf('.')
  if (separator < 1) return null

  const encoded = token.slice(0, separator)
  const suppliedSignature = token.slice(separator + 1)
  if (!safelyEqual(suppliedSignature, signature(encoded, secret))) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload
    const expectedUsername = process.env.REVIEW_ADMIN_USERNAME || 'marta'
    if (
      payload.username !== expectedUsername ||
      typeof payload.csrf !== 'string' ||
      payload.csrf.length < 20 ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Date.now()
    ) return null
    return payload
  } catch {
    return null
  }
}

export function adminSessionFromRequest(request: NextRequest) {
  return readAdminSession(request.cookies.get(REVIEW_ADMIN_COOKIE)?.value)
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(REVIEW_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(REVIEW_ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  const allowedOrigins = new Set([new URL(request.url).origin])
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (configuredSiteUrl) {
    try {
      allowedOrigins.add(new URL(configuredSiteUrl).origin)
    } catch {
      // Invalid configuration must not broaden the allowlist.
    }
  }
  return allowedOrigins.has(origin)
}

export function hasValidCsrf(request: NextRequest, session: SessionPayload) {
  const supplied = request.headers.get('x-csrf-token')
  return Boolean(supplied && safelyEqual(supplied, session.csrf))
}
