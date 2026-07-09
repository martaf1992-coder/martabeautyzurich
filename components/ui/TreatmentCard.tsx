import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface TreatmentItem {
  key: string
  duration: string
  price: string
}

interface Props {
  item: TreatmentItem
  locale: string
}

export default function TreatmentCard({ item, locale }: Props) {
  const t = useTranslations('treatments')
  const data = t.raw(`items.${item.key}`) as {
    en: string; it: string; desc: string; duration: string; price: string; originalPrice?: string; discountLabel?: string
  }
  const displayedPrice = data.originalPrice ? Number(data.price) : Math.round(Number(data.price) * 0.8)
  const originalPrice = data.originalPrice ?? data.price
  const discountLabel = data.discountLabel ?? '-20%'

  return (
    <article className="card relative flex flex-col gap-4 group hover:border-accent transition-colors duration-200">
      <div className="absolute -bottom-3 right-4 rounded-full bg-accent px-3 py-1.5 text-center shadow-sm">
        <span className="block font-sans text-[9px] font-semibold uppercase tracking-wider text-white leading-none">
          {discountLabel}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-light text-ink leading-snug">{data.en}</h3>
          {data.it !== data.en && (
            <p className="font-sans text-xs text-secondary mt-0.5">{data.it}</p>
          )}
        </div>
        <span className="font-sans text-xs font-medium whitespace-nowrap bg-parchment text-secondary px-2.5 py-1 rounded-full flex-shrink-0">
          {data.duration}
        </span>
      </div>

      <p className="font-sans text-sm text-secondary leading-relaxed flex-1">{data.desc}</p>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-serif text-base font-medium text-ink">
            CHF {displayedPrice}
          </span>
          <span className="font-sans text-xs text-secondary line-through">
            CHF {originalPrice}
          </span>
        </div>
        <Link
          href={`/${locale}/booking?treatment=${encodeURIComponent(item.key)}`}
          className="font-sans text-xs font-medium text-accent hover:text-accent-hover transition-colors tracking-wide"
        >
          {t('cta')} →
        </Link>
      </div>
    </article>
  )
}
