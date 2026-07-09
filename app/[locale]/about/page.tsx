import ScrollAnimator from '@/components/ui/ScrollAnimator'
import TeamCard from '@/components/ui/TeamCard'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return { title: t('aboutTitle'), description: t('aboutDescription') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const values = ['expertise', 'empathy', 'excellence'] as const
  const valueIcons: Record<typeof values[number], string> = {
    expertise: '✦',
    empathy: '♡',
    excellence: '◇',
  }

  return (
    <div className="pt-24 pb-20">

      {/* Header */}
      <section className="bg-parchment px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-border overflow-hidden flex-shrink-0">
            <Image
              src="/images/FotoProfilo.png"
              alt="Marta Fantozzi"
              width={512}
              height={512}
              sizes="(min-width: 1024px) 256px, 192px"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="section-label mb-3">{t('label')}</p>
            <h1 className="font-serif text-display-lg font-light text-ink mb-6">{t('heading')}</h1>
            <p className="font-sans text-base text-secondary leading-relaxed whitespace-pre-line">
              {t('bioIntro')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8">

        {/* Detailed bio */}
        <section className="py-16" aria-label="Marta's story">
          <div className="divider mb-10" />
          <ScrollAnimator>
            <p className="font-sans text-base text-secondary leading-relaxed max-w-3xl">
              {t('bioDetail')}
            </p>
          </ScrollAnimator>
        </section>

        {/* Values */}
        <section className="py-8 pb-16" aria-labelledby="values-heading">
          <div className="divider mb-10" />
          <h2 id="values-heading" className="font-serif text-display-md font-light text-ink mb-10 text-center">
            {t('valuesLabel')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <ScrollAnimator key={v} delay={i * 80}>
                <div className="card text-center flex flex-col items-center gap-3">
                  <span className="text-2xl text-accent" aria-hidden="true">{valueIcons[v]}</span>
                  <h3 className="font-serif text-lg font-light text-ink">
                    {(t.raw(`values.${v}`) as { title: string; desc: string }).title}
                  </h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed">
                    {(t.raw(`values.${v}`) as { title: string; desc: string }).desc}
                  </p>
                </div>
              </ScrollAnimator>
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section className="py-8 pb-16" aria-labelledby="credentials-heading">
          <div className="divider mb-10" />
          <h2 id="credentials-heading" className="font-serif text-display-md font-light text-ink mb-8 text-center">
            {t('credentialsLabel')}
          </h2>
          <ScrollAnimator>
            <div className="flex flex-wrap justify-center gap-2">
              {(t.raw('credentials') as string[]).map((c) => (
                <span key={c} className="badge">{c}</span>
              ))}
            </div>
          </ScrollAnimator>
        </section>

        {/* Team */}
        <section className="py-8 pb-16 border-t border-border" aria-labelledby="about-team-heading">
          <h2 id="about-team-heading" className="font-serif text-display-md font-light text-ink mb-10 text-center">
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

      {/* CTA */}
      <section className="bg-ink py-16 px-6 text-center">
        <h2 className="font-serif text-display-md font-light text-white mb-6">
          Be your first priority.
        </h2>
        <Link href={`/${locale}/booking`} className="btn-primary">
          {t('cta')}
        </Link>
      </section>
    </div>
  )
}
