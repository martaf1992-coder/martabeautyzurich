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
  return { title: t('postpartumTitle'), description: t('postpartumDescription') }
}

export default async function PostpartumPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'postpartum' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  // Show the text in the page language
  const heroText = locale === 'it' ? t('heroIT') : t('heroEN')

  return (
    <div className="pt-24 pb-20">

      {/* Hero — emotional, full parchment */}
      <section
        className="bg-tier-mum px-6 py-20 lg:py-32"
        aria-labelledby="postpartum-heading"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-6">{t('label')}</p>
          <h1 id="postpartum-heading" className="font-serif text-display-lg font-light text-ink mb-10">
            {t('heading')}
          </h1>
          <blockquote className="font-serif text-xl lg:text-2xl font-light italic text-ink leading-relaxed">
            {heroText}
          </blockquote>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Who it's for */}
        <section className="py-16" aria-labelledby="for-who-heading">
          <div className="divider mb-10" />
          <h2 id="for-who-heading" className="font-serif text-display-md font-light text-ink mb-8 text-center">
            {t('forWho')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {(t.raw('forWhoItems') as string[]).map((item, i) => (
              <ScrollAnimator key={i} delay={i * 60}>
                <li className="card flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" aria-hidden="true" />
                  <span className="font-sans text-sm text-ink leading-relaxed">{item}</span>
                </li>
              </ScrollAnimator>
            ))}
          </ul>
        </section>

        {/* Mum program tiers */}
        <section className="py-8 pb-16" aria-labelledby="mum-programs-heading">
          <div className="divider mb-10" />
          <h2 id="mum-programs-heading" className="font-serif text-display-md font-light text-ink mb-10 text-center">
            {locale === 'it' ? 'I percorsi mamme' : 'The mum programs'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollAnimator>
              <ProgramTierCard tier="integratedMum" locale={locale} />
            </ScrollAnimator>
            <ScrollAnimator delay={100}>
              <ProgramTierCard tier="luxuryMum" locale={locale} />
            </ScrollAnimator>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 border-t border-border" aria-labelledby="pp-team-heading">
          <h2 id="pp-team-heading" className="font-serif text-display-md font-light text-ink mb-10 text-center">
            {t('teamLabel')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['teamMarta', 'teamNutritionist', 'teamDoula', 'teamHair'] as const).map((m, i) => (
              <ScrollAnimator key={m} delay={i * 70}>
                <TeamCard member={m} />
              </ScrollAnimator>
            ))}
          </div>
        </section>
      </div>

      {/* CTA strip */}
      <section className="bg-tier-mum border-t border-border py-16 px-6 text-center">
        <Link href={`/${locale}/booking`} className="btn-primary text-base px-10 py-4">
          {t('cta')}
        </Link>
      </section>
    </div>
  )
}
