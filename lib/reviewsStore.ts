import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'
import { LocalReview } from '@/lib/localReviews'

const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json')
const reviewsBlobKey = 'reviews.json'

function canUseNetlifyBlobs() {
  return Boolean(
    globalThis.netlifyBlobsContext ||
    process.env.NETLIFY_BLOBS_CONTEXT ||
    (process.env.NETLIFY === 'true' && process.env.AWS_LAMBDA_FUNCTION_NAME)
  )
}

function normalizeReviews(reviews: unknown): LocalReview[] {
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
}

async function readFileReviews(): Promise<LocalReview[]> {
  const file = await fs.readFile(reviewsFile, 'utf8')
  return normalizeReviews(JSON.parse(file))
}

async function getReviewsBlobStore() {
  const { getStore } = await import('@netlify/blobs')
  return getStore('reviews')
}

export async function readReviews(): Promise<LocalReview[]> {
  if (canUseNetlifyBlobs()) {
    const store = await getReviewsBlobStore()
    const reviews = normalizeReviews(
      await store.get(reviewsBlobKey, { type: 'json' })
    )

    if (reviews.length) return reviews
  }

  try {
    return await readFileReviews()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function writeReviews(reviews: LocalReview[]) {
  if (canUseNetlifyBlobs()) {
    const store = await getReviewsBlobStore()
    await store.setJSON(reviewsBlobKey, normalizeReviews(reviews))
    return
  }

  await fs.mkdir(path.dirname(reviewsFile), { recursive: true })
  await fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8')
}
