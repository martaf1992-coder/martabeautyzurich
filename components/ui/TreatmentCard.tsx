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

const durationStyles: Record<string, string> = {
  '30 min': 'border-[#F4D8E1] bg-[#FCEFF3] text-[#8A5263]',
  '45 min': 'border-[#EFCBD7] bg-[#F9E6EC] text-[#824A5C]',
  '50 min': 'border-[#ECC4D2] bg-[#F7E1E8] text-[#7D4658]',
  '60 min': 'border-[#E9BECF] bg-[#F6DCE5] text-[#794255]',
  '90 min': 'border-[#E3B1C4] bg-[#F2D1DD] text-[#713B4E]',
}

export default function TreatmentCard({ item, locale }: Props) {
  const t = useTranslations('treatments')
  const data = t.raw(`items.${item.key}`) as {
    en: string; it: string; desc: string; duration: string; price: string
  }
  return (
    <article className="card flex h-full min-h-[280px] flex-col gap-4 group hover:border-accent transition-colors duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-light text-ink leading-snug">{data.en}</h3>
          {data.it !== data.en && (
            <p className="font-sans text-xs text-secondary mt-0.5">{data.it}</p>
          )}
        </div>
        <span className={`rounded-full border px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap flex-shrink-0 ${
          durationStyles[data.duration] ?? durationStyles['60 min']
        }`}>
          {data.duration}
        </span>
      </div>

      <p className="font-sans text-sm text-secondary leading-relaxed flex-1">{data.desc}</p>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
        <span className="font-serif text-base font-medium text-ink whitespace-nowrap">
          CHF {data.price}
        </span>
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
