import BookingCalendar from '@/components/ui/BookingCalendar'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ treatment?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return { title: t('bookingTitle'), description: t('bookingDescription') }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { treatment } = (await searchParams) ?? {}
  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <div className="pt-24 pb-20">
      <section className="bg-parchment px-6 py-16 lg:py-24 text-center">
        <p className="section-label mb-3">{t('label')}</p>
        <h1 className="font-serif text-display-lg font-light text-ink mb-4">{t('heading')}</h1>
        <p className="font-sans text-base text-secondary max-w-lg mx-auto leading-relaxed">{t('intro')}</p>
      </section>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <BookingCalendar initialTreatment={treatment} locale={locale} />
      </div>
    </div>
  )
}
