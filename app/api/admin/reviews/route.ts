import { NextRequest, NextResponse } from 'next/server'
import {
  adminSessionFromRequest,
  hasValidCsrf,
  isSameOriginRequest,
} from '@/lib/reviewAdminAuth'
import { mutateReviews, readReviews } from '@/lib/reviewsStore'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = adminSessionFromRequest(request)
  if (!session) return unauthorized()

  const reviews = await readReviews()
  return NextResponse.json(
    { reviews, csrfToken: session.csrf },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

async function authorizeMutation(request: NextRequest) {
  const session = adminSessionFromRequest(request)
  if (!session) return { response: unauthorized() }
  if (!isSameOriginRequest(request) || !hasValidCsrf(request, session)) {
    return {
      response: NextResponse.json({ error: 'Invalid security token.' }, { status: 403 }),
    }
  }
  return { session }
}

export async function PATCH(request: NextRequest) {
  const authorization = await authorizeMutation(request)
  if ('response' in authorization) return authorization.response

  const body = await request.json().catch(() => null)
  const id = String(body?.id ?? '')
  if (!id) return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 })

  let found = false
  const reviews = await mutateReviews((current) => current.map((review) => {
    if (review.id !== id) return review
    found = true
    return { ...review, status: 'approved' as const }
  }))

  if (!found) return NextResponse.json({ error: 'Review not found.' }, { status: 404 })
  return NextResponse.json({ reviews })
}

export async function DELETE(request: NextRequest) {
  const authorization = await authorizeMutation(request)
  if ('response' in authorization) return authorization.response

  const body = await request.json().catch(() => null)
  const id = String(body?.id ?? '')
  if (!id) return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 })

  let found = false
  const reviews = await mutateReviews((current) => current.filter((review) => {
    if (review.id === id) {
      found = true
      return false
    }
    return true
  }))

  if (!found) return NextResponse.json({ error: 'Review not found.' }, { status: 404 })
  return NextResponse.json({ reviews })
}
