export type LocalReview = {
  id: string
  name: string
  rating: number
  message: string
  createdAt: string
}

export type ReviewInput = {
  name: string
  rating: number
  message: string
}

export const MAX_REVIEW_NAME_LENGTH = 80
export const MAX_REVIEW_MESSAGE_LENGTH = 700

export function normalizeReviewInput(input: ReviewInput): ReviewInput {
  return {
    name: input.name.trim().slice(0, MAX_REVIEW_NAME_LENGTH),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    message: input.message.trim().slice(0, MAX_REVIEW_MESSAGE_LENGTH),
  }
}

export function isValidReviewInput(input: ReviewInput) {
  const normalized = normalizeReviewInput(input)

  return (
    normalized.name.length >= 2 &&
    normalized.message.length >= 10 &&
    normalized.rating >= 1 &&
    normalized.rating <= 5
  )
}
