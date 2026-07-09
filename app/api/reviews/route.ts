import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { LocalReview, normalizeReviewInput, isValidReviewInput } from '@/lib/localReviews'

const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json')

async function readReviews(): Promise<LocalReview[]> {
  try {
    const file = await fs.readFile(reviewsFile, 'utf8')
    const reviews = JSON.parse(file)

    if (!Array.isArray(reviews)) return []

    return reviews
      .filter((review): review is LocalReview => (
        typeof review.id === 'string' &&
        typeof review.name === 'string' &&
        typeof review.message === 'string' &&
        typeof review.createdAt === 'string' &&
        typeof review.rating === 'number'
      ))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

async function writeReviews(reviews: LocalReview[]) {
  await fs.mkdir(path.dirname(reviewsFile), { recursive: true })
  await fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8')
}

export async function GET() {
  const reviews = await readReviews()
  return NextResponse.json({ reviews })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  const input = normalizeReviewInput({
    name: String(body?.name ?? ''),
    rating: Number(body?.rating ?? 0),
    message: String(body?.message ?? ''),
  })

  if (!isValidReviewInput(input)) {
    return NextResponse.json({ error: 'Invalid review submission.' }, { status: 400 })
  }

  const reviews = await readReviews()
  const review: LocalReview = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  }

  const updatedReviews = [review, ...reviews].slice(0, 100)
  await writeReviews(updatedReviews)

  return NextResponse.json({ review }, { status: 201 })
}
