import { NextRequest, NextResponse } from 'next/server'
import { LocalReview, normalizeReviewInput, isValidReviewInput } from '@/lib/localReviews'
import { readReviews, writeReviews } from '@/lib/reviewsStore'

export const dynamic = 'force-dynamic'

function redirectBack(req: NextRequest, status: 'success' | 'error') {
  const fallbackUrl = new URL('/', req.url)
  const redirectUrl = new URL(req.headers.get('referer') ?? fallbackUrl.toString())
  redirectUrl.searchParams.set('review', status)
  return NextResponse.redirect(redirectUrl, 303)
}

export async function GET() {
  const reviews = await readReviews()
  return NextResponse.json(
    { reviews },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const body = isJson
    ? await req.json().catch(() => null)
    : await req.formData().catch(() => null)

  const input = normalizeReviewInput({
    name: String(isJson ? body?.name ?? '' : body?.get('name') ?? ''),
    rating: Number(isJson ? body?.rating ?? 0 : body?.get('rating') ?? 0),
    message: String(isJson ? body?.message ?? '' : body?.get('message') ?? ''),
  })

  if (!isValidReviewInput(input)) {
    if (!isJson) return redirectBack(req, 'error')

    return NextResponse.json(
      { error: 'Invalid review submission.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const review: LocalReview = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  }

  try {
    const reviews = await readReviews()
    const updatedReviews = [review, ...reviews].slice(0, 100)
    await writeReviews(updatedReviews)
  } catch (error) {
    console.error('Review storage failed:', error)

    if (!isJson) return redirectBack(req, 'error')

    return NextResponse.json(
      { error: 'Review storage unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  if (!isJson) return redirectBack(req, 'success')

  return NextResponse.json(
    { review },
    { status: 201, headers: { 'Cache-Control': 'no-store' } }
  )
}
