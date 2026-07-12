import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'
import { LocalReview } from '@/lib/localReviews'

const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json')

export async function readReviews(): Promise<LocalReview[]> {
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

export async function writeReviews(reviews: LocalReview[]) {
  await fs.mkdir(path.dirname(reviewsFile), { recursive: true })
  await fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8')
}
