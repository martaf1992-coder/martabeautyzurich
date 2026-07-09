import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return { title: t('cancelledHeading'), robots: 'noindex' }
}

export default async function BookingCancelledPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-bg-muted">
      <div className="max-w-md mx-auto px-6 text-center">
        <span className="text-5xl mb-6 block" role="img" aria-label="arrow back">←</span>
        <h1 className="font-serif text-display-md font-light text-ink mb-4">{t('cancelledHeading')}</h1>
        <p className="font-sans text-sm text-secondary leading-relaxed mb-8">{t('cancelledText')}</p>
        <Link href={`/${locale}/booking`} className="btn-primary">
          {t('cancelledCta')}
        </Link>
      </div>
    </div>
  )
}
