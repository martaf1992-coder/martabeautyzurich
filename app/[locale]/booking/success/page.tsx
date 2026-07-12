import type { Metadata } from 'next'
import ReviewCard from '@/components/ui/ReviewCard'
import { readReviews } from '@/lib/reviewsStore'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return { title: t('successHeading'), robots: 'noindex' }
}

export default async function BookingSuccessPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  const reviews = await readReviews()

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-parchment">
      <div className="max-w-md mx-auto px-6 text-center">
        <span className="text-5xl mb-6 block" role="img" aria-label="check">✓</span>
        <h1 className="font-serif text-display-md font-light text-ink mb-4">{t('successHeading')}</h1>
        <p className="font-sans text-sm text-secondary leading-relaxed mb-8">{t('successText')}</p>
        <Link href={`/${locale}`} className="btn-primary">
          {t('successCta')}
        </Link>
        <ReviewCard compact initialReviews={reviews} />
      </div>
    </div>
  )
}
