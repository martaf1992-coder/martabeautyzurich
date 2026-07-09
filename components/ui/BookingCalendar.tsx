'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

const CALENDLY_TIMEZONE = 'Europe/Zurich'
const CALENDLY_URLS_BY_DURATION: Record<number, string> = {
  30: process.env.NEXT_PUBLIC_CALENDLY_30MIN_URL ?? 'https://calendly.com/marta-f1992/30min',
  45: process.env.NEXT_PUBLIC_CALENDLY_45MIN_URL ?? 'https://calendly.com/marta-f1992/45min',
  60: process.env.NEXT_PUBLIC_CALENDLY_60MIN_URL ?? 'https://calendly.com/marta-f1992/60min',
  90: process.env.NEXT_PUBLIC_CALENDLY_90MIN_URL ?? 'https://calendly.com/marta-f1992/90min',
}
const WA_NUMBER = '41766717753'
const treatmentKeys = [
  'ayurveda',
  'candle',
  'deepRelease',
  'backNeck',
  'drain',
  'sculpt',
  'deepInfinity',
  'premamum',
  'reflex',
  'dryBrush',
  'wrap',
  'cleanse',
  'silk',
  'collagen',
  'curativePedicure',
] as const

interface Props {
  initialTreatment?: string
  locale: string
}

function parseDurationMinutes(duration: string) {
  const minutes = Number.parseInt(duration, 10)
  return Number.isFinite(minutes) ? minutes : 30
}

function buildCalendlyUrl(baseUrl: string, treatmentLabel?: string) {
  const url = new URL(baseUrl)
  url.searchParams.set('hide_gdpr_banner', '1')
  url.searchParams.set('timezone', CALENDLY_TIMEZONE)

  if (treatmentLabel) {
    url.searchParams.set('a1', treatmentLabel)
  }

  return url.toString()
}

export default function BookingCalendar({ initialTreatment, locale }: Props) {
  const tBooking = useTranslations('booking')
  const tTreatments = useTranslations('treatments')
  const validInitialTreatment = treatmentKeys.includes(initialTreatment as typeof treatmentKeys[number])
    ? initialTreatment
    : ''
  const [selectedTreatment, setSelectedTreatment] = useState(validInitialTreatment)

  const selectedTreatmentLabel = useMemo(() => {
    if (!selectedTreatment) return ''
    const treatment = tTreatments.raw(`items.${selectedTreatment}`) as { en: string; it: string }
    return locale === 'it' ? treatment.it : treatment.en
  }, [locale, selectedTreatment, tTreatments])

  const selectedTreatmentDuration = useMemo(() => {
    if (!selectedTreatment) return 30
    const treatment = tTreatments.raw(`items.${selectedTreatment}`) as { duration: string }
    return parseDurationMinutes(treatment.duration)
  }, [selectedTreatment, tTreatments])

  const calendlyUrl = buildCalendlyUrl(
    CALENDLY_URLS_BY_DURATION[selectedTreatmentDuration] ?? CALENDLY_URLS_BY_DURATION[30],
    selectedTreatmentLabel
  )

  const waMessage = encodeURIComponent(
    locale === 'it'
      ? `Ciao Marta! Vorrei prenotare una sessione${selectedTreatmentLabel ? ` per: ${selectedTreatmentLabel}` : ''}`
      : `Hi Marta! I'd like to book a session${selectedTreatmentLabel ? ` for: ${selectedTreatmentLabel}` : ''}`
  )

  return (
    <>
      <div className="mb-6 rounded-card border border-border bg-white p-5">
        <label htmlFor="treatment" className="font-sans text-xs text-secondary uppercase tracking-widest mb-2 block">
          {tBooking('treatmentLabel')}
        </label>
        <select
          id="treatment"
          name="treatment"
          value={selectedTreatment}
          onChange={(event) => setSelectedTreatment(event.target.value)}
          className="w-full border border-border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition"
        >
          <option value="">{tBooking('treatmentPlaceholder')}</option>
          {treatmentKeys.map((key) => {
            const treatment = tTreatments.raw(`items.${key}`) as { en: string; it: string; duration: string; price: string }
            const label = locale === 'it' ? treatment.it : treatment.en

            return (
              <option key={key} value={key}>
                {label} - {treatment.duration} - CHF {treatment.price}
              </option>
            )
          })}
        </select>
        {selectedTreatmentLabel && (
          <p className="mt-3 font-sans text-xs text-secondary">
            {tBooking('selectedTreatment')}: <span className="text-ink">{selectedTreatmentLabel} - {selectedTreatmentDuration} min</span>
          </p>
        )}
      </div>

      <div
        className="rounded-card border border-border bg-white overflow-hidden min-h-[700px] mb-10"
        aria-label={tBooking('calendlyPlaceholder')}
      >
        <iframe
          key={calendlyUrl}
          src={calendlyUrl}
          title={tBooking('calendlyPlaceholder')}
          className="block w-full h-[760px] border-0"
          loading="lazy"
        />
      </div>

      <div className="divider my-10" />

      <div className="text-center flex flex-col items-center gap-4">
        <p className="font-sans text-sm text-secondary">{tBooking('whatsappCta')}</p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary bg-[#25D366] hover:bg-[#1ebe5d] border-none"
        >
          {tBooking('whatsappBtn')}
        </a>
        <a href={`/${locale}/contact`} className="font-sans text-xs text-accent hover:text-accent-hover transition-colors underline underline-offset-2">
          {tBooking('contactFallback')}
        </a>
      </div>
    </>
  )
}
