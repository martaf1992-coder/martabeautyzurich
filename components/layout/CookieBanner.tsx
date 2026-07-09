'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function CookieBanner() {
  const t = useTranslations('cookie')
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-sans text-sm text-secondary">{t('text')}</p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="font-sans text-xs text-secondary hover:text-ink underline underline-offset-2 transition-colors"
          >
            {t('manage')}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="btn-primary text-xs py-2 px-5"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
