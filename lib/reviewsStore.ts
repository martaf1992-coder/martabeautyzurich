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

let fileMutationQueue: Promise<void> = Promise.resolve()

export function normalizeReviews(reviews: unknown): LocalReview[] {
  if (!Array.isArray(reviews)) return []

  return reviews
    .filter((review): review is Omit<LocalReview, 'status'> & { status?: unknown } => (
      typeof review.id === 'string' &&
      typeof review.name === 'string' &&
      typeof review.message === 'string' &&
      typeof review.createdAt === 'string' &&
      typeof review.rating === 'number'
    ))
    .map((review) => ({
      ...review,
      // Reviews created before moderation existed are already public.
      status: review.status === undefined || review.status === 'approved' ? 'approved' : 'pending',
    }) satisfies LocalReview)
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
    const stored = await store.getWithMetadata(reviewsBlobKey, {
      type: 'json',
      consistency: 'strong',
    })

    // An existing empty blob is authoritative. Falling back here would
    // resurrect reviews after an administrator deleted the final record.
    if (stored) return normalizeReviews(stored.data)
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

export async function readPublishedReviews(): Promise<LocalReview[]> {
  return (await readReviews()).filter((review) => review.status === 'approved')
}

export async function mutateReviews(
  update: (reviews: LocalReview[]) => LocalReview[]
): Promise<LocalReview[]> {
  if (canUseNetlifyBlobs()) {
    const store = await getReviewsBlobStore()

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const stored = await store.getWithMetadata(reviewsBlobKey, {
        type: 'json',
        consistency: 'strong',
      })
      const current = stored ? normalizeReviews(stored.data) : await readFileReviews().catch(() => [])
      const next = normalizeReviews(update(current))
      const result = stored
        ? await store.setJSON(reviewsBlobKey, next, { onlyIfMatch: stored.etag })
        : await store.setJSON(reviewsBlobKey, next, { onlyIfNew: true })

      if (result.modified) return next
    }

    throw new Error('Review storage changed too many times; please retry.')
  }

  let resolveMutation!: () => void
  const previousMutation = fileMutationQueue
  fileMutationQueue = new Promise<void>((resolve) => {
    resolveMutation = resolve
  })

  await previousMutation
  try {
    const current = await readFileReviews().catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return []
      throw error
    })
    const next = normalizeReviews(update(current))
    await fs.mkdir(path.dirname(reviewsFile), { recursive: true })
    const temporaryFile = `${reviewsFile}.${process.pid}.${crypto.randomUUID()}.tmp`
    await fs.writeFile(temporaryFile, JSON.stringify(next, null, 2), 'utf8')
    await fs.rename(temporaryFile, reviewsFile)
    return next
  } finally {
    resolveMutation()
  }
}
