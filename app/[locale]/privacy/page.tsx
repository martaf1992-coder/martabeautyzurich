import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return { title: t('privacyTitle'), robots: 'noindex' }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <nav className="mb-8">
          <Link href={`/${locale}`} className="font-sans text-xs text-secondary hover:text-accent transition-colors">
            ← {t('backHome')}
          </Link>
        </nav>
        <h1 className="font-serif text-display-md font-light text-ink mb-3">{t('privacyTitle')}</h1>
        <p className="font-sans text-xs text-secondary mb-10">{t('lastUpdated')}</p>

        <div className="prose prose-sm max-w-none font-sans text-secondary leading-relaxed space-y-6">
          {/* TODO: replace with your actual Privacy Policy (compliant with Swiss DSG / GDPR) */}
          <p>{t('privacyPlaceholder')}</p>
          <p className="text-xs opacity-60">{t('privacyTodo')}</p>
        </div>
      </div>
    </div>
  )
}
