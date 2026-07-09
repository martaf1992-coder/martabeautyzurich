import { GOOGLE_REVIEW_URL } from '@/lib/reviews'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Review Marta Beauty Zurich',
  robots: 'noindex',
}

export default function ReviewRedirectPage() {
  redirect(GOOGLE_REVIEW_URL)
}
