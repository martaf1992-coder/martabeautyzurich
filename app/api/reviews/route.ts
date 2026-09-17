import { NextRequest, NextResponse } from 'next/server'
import { LocalReview, normalizeReviewInput, isValidReviewInput } from '@/lib/localReviews'
import { mutateReviews, readPublishedReviews } from '@/lib/reviewsStore'
import { verifyReviewCaptcha } from '@/lib/turnstile'

export const dynamic = 'force-dynamic'
const MAX_PENDING_REVIEWS = 100

class PendingQueueFullError extends Error {}

function redirectBack(req: NextRequest, status: 'success' | 'error') {
  const fallbackUrl = new URL('/', req.url)
  let redirectUrl = fallbackUrl
  try {
    const referer = new URL(req.headers.get('referer') ?? fallbackUrl.toString())
    if (referer.origin === fallbackUrl.origin) redirectUrl = referer
  } catch {
    // Keep the safe same-origin fallback.
  }
  redirectUrl.searchParams.set('review', status)
  return NextResponse.redirect(redirectUrl, 303)
}

export async function GET() {
  const reviews = await readPublishedReviews()
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
  const captchaToken = String(
    isJson ? body?.turnstileToken ?? '' : body?.get('cf-turnstile-response') ?? ''
  )

  if (!isValidReviewInput(input)) {
    if (!isJson) return redirectBack(req, 'error')

    return NextResponse.json(
      { error: 'Invalid review submission.', code: 'INVALID_REVIEW' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const remoteIp = req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const captcha = await verifyReviewCaptcha(captchaToken, remoteIp || undefined)
  if (!captcha.ok) {
    if (!isJson) return redirectBack(req, 'error')
    return NextResponse.json(
      {
        error: captcha.configurationError ? 'Review CAPTCHA is not configured.' : 'Human verification failed.',
        code: captcha.configurationError ? 'CAPTCHA_CONFIGURATION' : 'CAPTCHA_FAILED',
      },
      { status: captcha.configurationError ? 503 : 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const review: LocalReview = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  try {
    await mutateReviews((reviews) => {
      const approved = reviews.filter((item) => item.status === 'approved')
      const pending = reviews.filter((item) => item.status === 'pending')
      if (pending.length >= MAX_PENDING_REVIEWS) throw new PendingQueueFullError()
      return [review, ...pending, ...approved]
    })
  } catch (error) {
    if (error instanceof PendingQueueFullError) {
      if (!isJson) return redirectBack(req, 'error')
      return NextResponse.json(
        { error: 'Review queue is full.', code: 'REVIEW_QUEUE_FULL' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    console.error('Review storage failed:', error)
    if (!isJson) return redirectBack(req, 'error')

    return NextResponse.json(
      { error: 'Review storage unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  if (!isJson) return redirectBack(req, 'success')

  return NextResponse.json(
    { accepted: true, status: 'pending' },
    { status: 202, headers: { 'Cache-Control': 'no-store' } }
  )
}
