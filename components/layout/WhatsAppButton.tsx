'use client'

import type { Locale } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface Props {
  locale: Locale
}

const WA_NUMBER = '41766717753'

export default function WhatsAppButton({ locale }: Props) {
  const t = useTranslations('whatsapp')
  const message = encodeURIComponent(t('message'))
  const href = `https://wa.me/${WA_NUMBER}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('label')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1ebe5d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.57A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22a9.94 9.94 0 0 1-5.08-1.39l-.36-.22-3.69.93.97-3.59-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.3c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H6.9c-.17 0-.45.07-.69.35-.23.28-.9.88-.9 2.14s.93 2.48 1.06 2.65c.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.27-.17-.57-.3z" />
      </svg>
    </a>
  )
}
