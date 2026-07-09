import { HAS_GOOGLE_REVIEW_URL, GOOGLE_REVIEW_URL } from '@/lib/reviews'
import { useLocale, useTranslations } from 'next-intl'

interface Props {
  compact?: boolean
}

export default function ReviewCard({ compact = false }: Props) {
  const locale = useLocale()
  const t = useTranslations('reviews')
  const reviewHref = HAS_GOOGLE_REVIEW_URL ? `/${locale}/review` : GOOGLE_REVIEW_URL

  const content = (
    <>
      <p className="section-label mb-3">{t('label')}</p>
      <h2 id={compact ? undefined : 'reviews-heading'} className="font-serif text-display-md font-light text-ink mb-4">
        {t('heading')}
      </h2>
      <p className="font-sans text-sm text-secondary leading-relaxed max-w-xl mx-auto mb-6">
        {t('text')}
      </p>
      <a
        href={reviewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {HAS_GOOGLE_REVIEW_URL ? t('cta') : t('fallbackCta')}
      </a>
      {!HAS_GOOGLE_REVIEW_URL && (
        <p className="mt-3 font-sans text-xs text-secondary">
          {t('setupHint')}
        </p>
      )}
    </>
  )

  if (compact) {
    return (
      <div className="mt-8 border-t border-border pt-8 text-center">
        {content}
      </div>
    )
  }

  return (
    <section className="bg-white py-16 lg:py-20 px-6 text-center" aria-labelledby="reviews-heading">
      <div className="max-w-3xl mx-auto">
        {content}
      </div>
    </section>
  )
}
