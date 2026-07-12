import type { Metadata } from 'next'
import ReviewCard from '@/components/ui/ReviewCard'
import { readReviews } from '@/lib/reviewsStore'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })

  return {
    title: `${t('heading')} - Marta Beauty Zurich`,
    robots: 'noindex',
  }
}

export default async function ReviewPage() {
  const reviews = await readReviews()

  return (
    <main className="pt-24 bg-white min-h-screen">
      <ReviewCard initialReviews={reviews} />
    </main>
  )
}
