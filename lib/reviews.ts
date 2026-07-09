const fallbackReviewUrl = 'https://www.google.com/search?q=Marta+Beauty+Zurich+reviews'

export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() || fallbackReviewUrl

export const HAS_GOOGLE_REVIEW_URL = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim()
)
