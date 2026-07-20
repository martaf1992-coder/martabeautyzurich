import ScrollAnimator from '@/components/ui/ScrollAnimator'
import TreatmentCard from '@/components/ui/TreatmentCard'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return { title: t('treatmentsTitle'), description: t('treatmentsDescription') }
}

const massages = ['ayurveda', 'candle', 'deepRelease', 'backNeck', 'drain', 'sculpt', 'deepInfinity', 'premamum']
const body     = ['reflex', 'dryBrush', 'wrap', 'pureBody']
const facial   = ['cleanse', 'silk', 'collagen', 'phytoHarmony']
const pedicure = ['curativePedicure']

export default async function TreatmentsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'treatments' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <div className="pt-24 pb-20">

      {/* Page header */}
      <section className="bg-parchment px-6 py-16 lg:py-24 text-center">
        <p className="section-label mb-3">{t('label')}</p>
        <h1 className="font-serif text-display-lg font-light text-ink mb-4">{t('heading')}</h1>
        <p className="font-sans text-base text-secondary max-w-xl mx-auto leading-relaxed">{t('sub')}</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Massages */}
        <section className="py-16" aria-labelledby="massages-heading">
          <div className="divider mb-10" />
          <h2 id="massages-heading" className="font-serif text-display-md font-light text-ink mb-10">
            {t('massages')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {massages.map((key, i) => (
              <ScrollAnimator key={key} delay={i * 50}>
                <TreatmentCard item={{ key, duration: '', price: '' }} locale={locale} />
              </ScrollAnimator>
            ))}
          </div>
        </section>

        {/* Body Treatments */}
        <section className="py-16" aria-labelledby="body-heading">
          <div className="divider mb-10" />
          <h2 id="body-heading" className="font-serif text-display-md font-light text-ink mb-10">
            {t('body')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {body.map((key, i) => (
              <ScrollAnimator key={key} delay={i * 50}>
                <TreatmentCard item={{ key, duration: '', price: '' }} locale={locale} />
              </ScrollAnimator>
            ))}
          </div>
        </section>

        {/* Facial Treatments */}
        <section className="py-16" aria-labelledby="facial-heading">
          <div className="divider mb-10" />
          <h2 id="facial-heading" className="font-serif text-display-md font-light text-ink mb-10">
            {t('facial')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facial.map((key, i) => (
              <ScrollAnimator key={key} delay={i * 50}>
                <TreatmentCard item={{ key, duration: '', price: '' }} locale={locale} />
              </ScrollAnimator>
            ))}
          </div>
        </section>

        {/* Pedicure */}
        <section className="py-16" aria-labelledby="pedicure-heading">
          <div className="divider mb-10" />
          <h2 id="pedicure-heading" className="font-serif text-display-md font-light text-ink mb-10">
            {t('pedicure')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedicure.map((key, i) => (
              <ScrollAnimator key={key} delay={i * 50}>
                <TreatmentCard item={{ key, duration: '', price: '' }} locale={locale} />
              </ScrollAnimator>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom CTA */}
      <section className="bg-ink py-16 px-6 text-center mt-8">
        <h2 className="font-serif text-display-md font-light text-white mb-6">
          Be your first priority.
        </h2>
        <Link href={`/${locale}/booking`} className="btn-primary">
          {tNav('book')}
        </Link>
      </section>
    </div>
  )
}
