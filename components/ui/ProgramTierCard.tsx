import { useTranslations } from 'next-intl'
import Link from 'next/link'

type TierStyle = 'essential' | 'integrated' | 'luxury' | 'integratedMum' | 'luxuryMum'

const tierStyles: Record<TierStyle, string> = {
  essential:     'bg-tier-essential border-[#D8D4CC]',
  integrated:    'bg-tier-integrated border-[#B8DDD0]',
  luxury:        'bg-tier-luxury border-[#C8C4E8]',
  integratedMum: 'bg-tier-mum border-[#DFC4BE]',
  luxuryMum:     'bg-tier-mum border-[#DFC4BE]',
}

interface Props {
  tier: TierStyle
  locale: string
}

export default function ProgramTierCard({ tier, locale }: Props) {
  const t = useTranslations('programs')
  const data = t.raw(tier) as { name: string; tagline: string; includes: string[] }

  return (
    <article className={`rounded-card border p-6 flex flex-col gap-5 ${tierStyles[tier]}`}>
      <div>
        {/* TODO: insert CHF price */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-serif text-xl font-light text-ink">{data.name}</h3>
          <div className="flex flex-col items-end gap-2">
            <span className="font-sans text-sm font-semibold tracking-wide text-white bg-accent px-4 py-2 rounded-full shadow-sm">
              {t('comingSoon')}
            </span>
            <span className="font-sans text-sm text-secondary">{t('pricePlaceholder')}</span>
          </div>
        </div>
        <p className="font-sans text-xs text-secondary">{data.tagline}</p>
      </div>

      <ul className="flex flex-col gap-2" aria-label={`Includes in ${data.name}`}>
        {data.includes.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 font-sans text-sm text-ink">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={`/${locale}/booking`}
        className="btn-primary self-start text-sm mt-auto"
      >
        {t('ctaGetStarted')}
      </Link>
    </article>
  )
}
