'use client'

import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const subjects = ['generalInquiry', 'bookingHelp', 'programInfo', 'postpartum'] as const

export default function ContactForm() {
  const t = useTranslations('contact.form')
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (fd: FormData): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!String(fd.get('name')).trim()) e.name = t('errors.nameRequired')
    const email = String(fd.get('email')).trim()
    if (!email) e.email = t('errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('errors.emailInvalid')
    if (!String(fd.get('subject'))) e.subject = t('errors.subjectRequired')
    if (!String(fd.get('message')).trim()) e.message = t('errors.messageRequired')
    return e
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const errs = validate(fd)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setState('loading')

    const res = await fetch('/api/contact', { method: 'POST', body: fd })
    if (!res.ok) { setState('error'); return }
    setState('success')
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">✓</span>
        <p className="font-serif text-xl text-ink">{t('successMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
          {t('namePlaceholder')}
        </label>
        <input
          id="name" name="name" type="text" autoComplete="given-name"
          className={`w-full border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition ${errors.name ? 'border-red-400' : 'border-border'}`}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <p id="name-error" className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
          {t('emailPlaceholder')}
        </label>
        <input
          id="email" name="email" type="email" autoComplete="email"
          className={`w-full border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition ${errors.email ? 'border-red-400' : 'border-border'}`}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="phone" className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
          {t('phonePlaceholder')} <span className="normal-case text-[10px] opacity-50">(optional)</span>
        </label>
        <input
          id="phone" name="phone" type="tel" autoComplete="tel"
          className="w-full border border-border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
          {t('subjectPlaceholder')}
        </label>
        <select
          id="subject" name="subject"
          className={`w-full border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition appearance-none ${errors.subject ? 'border-red-400' : 'border-border'}`}
          aria-invalid={!!errors.subject} defaultValue=""
        >
          <option value="" disabled>{t('subjectPlaceholder')}</option>
          {subjects.map(s => (
            <option key={s} value={s}>{t(`subjects.${s}`)}</option>
          ))}
        </select>
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
          {t('messagePlaceholder')}
        </label>
        <textarea
          id="message" name="message" rows={5}
          className={`w-full border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition resize-none ${errors.message ? 'border-red-400' : 'border-border'}`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <p id="message-error" className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      {state === 'error' && (
        <p className="text-xs text-red-500 text-center">{t('errors.generic')}</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? '...' : t('submitBtn')}
      </button>
    </form>
  )
}
