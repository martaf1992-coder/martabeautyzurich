import ProgramTierCard from '@/components/ui/ProgramTierCard'
import ScrollAnimator from '@/components/ui/ScrollAnimator'
import TeamCard from '@/components/ui/TeamCard'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return { title: t('programsTitle'), description: t('programsDescription') }
}

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'programs' })
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

        {/* Essential — base tier */}
        <section className="py-16" aria-labelledby="essential-heading">
          <div className="divider mb-10" />
          <ScrollAnimator>
            <div className="rounded-card border border-[#D8D4CC] bg-tier-essential p-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                <h2 id="essential-heading" className="font-serif text-2xl font-light text-ink">
                  {t('essential.name')}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-sm font-semibold tracking-wide text-white bg-accent px-4 py-2 rounded-full shadow-sm">
                    {t('comingSoon')}
                  </span>
                  {/* TODO: insert CHF price */}
                  <span className="font-sans text-sm text-secondary">{t('pricePlaceholder')}</span>
                </div>
              </div>
              <p className="font-sans text-xs text-secondary mb-6">{t('essential.tagline')}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(t.raw('essential.includes') as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 font-sans text-sm text-ink">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/booking`} className="btn-primary mt-8 inline-block">
                {t('ctaGetStarted')}
              </Link>
            </div>
          </ScrollAnimator>
        </section>

        {/* Two tracks side by side */}
        <section className="py-8 pb-16" aria-label="Program tracks">
          <div className="divider mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Standard track */}
            <div>
              <p className="section-label mb-6">{t('trackStandard')}</p>
              <div className="flex flex-col gap-6">
                <ScrollAnimator>
                  <ProgramTierCard tier="integrated" locale={locale} />
                </ScrollAnimator>
                <ScrollAnimator delay={80}>
                  <ProgramTierCard tier="luxury" locale={locale} />
                </ScrollAnimator>
              </div>
            </div>

            {/* Vertical divider (desktop only) */}
            <div className="hidden lg:block absolute left-1/2 h-full w-px bg-border pointer-events-none" aria-hidden="true" />

            {/* Mum track */}
            <div>
              <p className="section-label mb-6">{t('trackMum')}</p>
              <div className="flex flex-col gap-6">
                <ScrollAnimator>
                  <ProgramTierCard tier="integratedMum" locale={locale} />
                </ScrollAnimator>
                <ScrollAnimator delay={80}>
                  <ProgramTierCard tier="luxuryMum" locale={locale} />
                </ScrollAnimator>
              </div>
            </div>
          </div>
        </section>

        {/* Team section */}
        <section className="py-16 border-t border-border" aria-labelledby="team-heading">
          <h2 id="team-heading" className="font-serif text-display-md font-light text-ink mb-10 text-center">
            {t('teamLabel')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['teamMarta', 'teamNutritionist', 'teamHair', 'teamDoula'] as const).map((m, i) => (
              <ScrollAnimator key={m} delay={i * 70}>
                <TeamCard member={m} />
              </ScrollAnimator>
            ))}
          </div>
        </section>
      </div>

      {/* CTA strip */}
      <section className="bg-ink py-16 px-6 text-center">
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
