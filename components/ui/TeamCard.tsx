import { useTranslations } from 'next-intl'

type Member = 'teamMarta' | 'teamNutritionist' | 'teamHair' | 'teamDoula'

interface Props {
  member: Member
  accentColor?: string
}

const dots: Record<Member, string> = {
  teamMarta:        'bg-accent',
  teamNutritionist: 'bg-[#1D9E75]',
  teamHair:         'bg-[#7F77DD]',
  teamDoula:        'bg-[#C9A0A0]',
}

export default function TeamCard({ member, accentColor }: Props) {
  const t = useTranslations('programs')
  const data = t.raw(member) as { name: string; role: string; desc: string }

  return (
    <div className="card flex flex-col gap-2">
      <div className={`w-2 h-2 rounded-full mb-1 ${dots[member]}`} aria-hidden="true" />
      <p className="font-serif text-base font-light text-ink">{data.name}</p>
      <p className="font-sans text-xs font-medium text-accent uppercase tracking-wider">{data.role}</p>
      <p className="font-sans text-sm text-secondary leading-relaxed">{data.desc}</p>
    </div>
  )
}
