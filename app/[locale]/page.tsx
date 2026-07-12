import ScrollAnimator from '@/components/ui/ScrollAnimator'
import ReviewCard from '@/components/ui/ReviewCard'
import TreatmentCard from '@/components/ui/TreatmentCard'
import { readReviews } from '@/lib/reviewsStore'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: { title: t('homeTitle'), description: t('homeDescription') },
  }
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Marta Beauty Zurich',
  url: 'https://martabeautyzurich.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pfäffikon',
    addressRegion: 'ZH',
    addressCountry: 'CH',
  },
  priceRange: 'CHF 80–220',
  serviceType: 'Mobile Beauty & Wellness',
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  const tTrust = await getTranslations({ locale, namespace: 'trust' })
  const tPillars = await getTranslations({ locale, namespace: 'pillars' })
  const tTargets = await getTranslations({ locale, namespace: 'targets' })
  const tFeatured = await getTranslations({ locale, namespace: 'featured' })
  const tAbout = await getTranslations({ locale, namespace: 'aboutTeaser' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const reviews = await readReviews()

  // Featured treatments shown on home page
  const featuredKeys = ['deepInfinity', 'collagen', 'ayurveda']

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        className="min-h-screen bg-parchment flex flex-col items-center justify-center text-center px-6 pt-24 pb-20"
        aria-label="Hero"
      >
        {/* Logo mark — centred above heading */}
        <div className="mb-10">
          <Image
            src="/images/logo2.jpg"
            alt="Marta Beauty Zurich"
            width={180}
            height={180}
            className="h-36 w-auto mx-auto sm:h-44"
            priority
          />
        </div>

        <h1 className="font-serif text-display-xl font-light text-ink max-w-2xl mb-6">
          {t('tagline')}
        </h1>
        <p className="font-sans text-base lg:text-lg text-secondary max-w-xl leading-relaxed mb-10">
          {t('sub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/programs`} className="btn-primary">
            {t('ctaPrograms')}
          </Link>
          <Link href={`/${locale}/booking`} className="btn-outline">
            {t('ctaTreatments')}
          </Link>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-2 text-secondary" aria-hidden="true">
          <span className="block w-px h-10 bg-border" />
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────── */}
      <section className="bg-white border-y border-border py-10" aria-label="Trust indicators">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏠', text: tTrust('home') },
              { icon: '🌍', text: tTrust('online') },
              { icon: '✦', text: tTrust('experience') },
              { icon: '◇', text: tTrust('personalized') },
            ].map(({ icon, text }) => (
              <li key={text} className="flex flex-col items-center text-center gap-2">
                <span className="text-2xl" aria-hidden="true">{icon}</span>
                <span className="font-sans text-xs text-secondary leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SERVICE PILLARS ─────────────────────────────────── */}
      <section className="bg-bg-muted py-20 lg:py-28 px-6" aria-labelledby="pillars-heading">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-3">{tPillars('label')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10">

            {/* Treatments pillar */}
            <ScrollAnimator>
              <div className="card flex flex-col gap-4 h-full">
                <span className="text-3xl" aria-hidden="true">◦</span>
                <h2 className="font-serif text-display-md font-light text-ink">
                  {tPillars('treatments.title')}
                </h2>
                <p className="font-sans text-sm text-secondary leading-relaxed flex-1">
                  {tPillars('treatments.desc')}
                </p>
                <Link href={`/${locale}/treatments`} className="btn-outline self-start text-sm">
                  {tPillars('treatments.cta')}
                </Link>
              </div>
            </ScrollAnimator>

            {/* Programs pillar */}
            <ScrollAnimator delay={100}>
              <div className="card flex flex-col gap-4 h-full">
                <span className="text-3xl" aria-hidden="true">✦</span>
                <span className="font-sans text-sm font-semibold tracking-wide text-white bg-accent px-4 py-2 rounded-full shadow-sm self-start">
                  {tPillars('programs.comingSoon')}
                </span>
                <h2 className="font-serif text-display-md font-light text-ink">
                  {tPillars('programs.title')}
                </h2>
                <p className="font-sans text-sm text-secondary leading-relaxed flex-1">
                  {tPillars('programs.desc')}
                </p>
                <Link href={`/${locale}/programs`} className="btn-outline self-start text-sm">
                  {tPillars('programs.cta')}
                </Link>
              </div>
            </ScrollAnimator>
          </div>
        </div>
      </section>

      {/* ── TARGET AUDIENCE ─────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28 px-6" aria-labelledby="targets-heading">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-12">{tTargets('label')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'mama', emoji: '🤱' },
              { key: 'career', emoji: '💼' },
              { key: 'change', emoji: '🌿' },
            ].map(({ key, emoji }, i) => (
              <ScrollAnimator key={key} delay={i * 80}>
                <div className="card text-center flex flex-col items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{emoji}</span>
                  <h3 className="font-serif text-lg font-light text-ink">
                    {tTargets(`${key}.title` as any)}
                  </h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed">
                    {tTargets(`${key}.desc` as any)}
                  </p>
                </div>
              </ScrollAnimator>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TREATMENTS ─────────────────────────────── */}
      <section className="bg-bg-muted py-20 lg:py-28 px-6" aria-labelledby="featured-heading">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-3">{tFeatured('label')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {featuredKeys.map((key, i) => (
              <ScrollAnimator key={key} delay={i * 80}>
                <TreatmentCard item={{ key, duration: '', price: '' }} locale={locale} />
              </ScrollAnimator>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/treatments`} className="btn-outline">
              {tFeatured('cta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ────────────────────────────────────── */}
      <section className="bg-parchment py-20 lg:py-28 px-6" aria-labelledby="about-teaser-heading">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-6">{tAbout('label')}</p>
          <div className="w-32 h-32 rounded-full bg-border mx-auto mb-8 overflow-hidden border border-border">
            <Image
              src="/images/FotoProfilo.png"
              alt="Marta Fantozzi"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-sans text-base text-secondary leading-relaxed mb-8">
            {tAbout('text')}
          </p>
          <Link href={`/${locale}/about`} className="btn-outline">
            {tAbout('cta')}
          </Link>
        </div>
      </section>

      {/* ── FOOTER CTA STRIP ────────────────────────────────── */}
      <ReviewCard initialReviews={reviews} />

      <section className="bg-ink py-16 px-6 text-center" aria-label="Call to action">
        <h2 className="font-serif text-display-md font-light text-white mb-6">
          Be your first priority.
        </h2>
        <Link href={`/${locale}/booking`} className="btn-primary text-sm">
          {tNav('book')}
        </Link>
      </section>
    </>
  )
}
