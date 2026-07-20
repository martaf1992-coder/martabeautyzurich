import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const CONTACT_PHONE = '+41 76 671 77 53'
const INSTAGRAM_URL = 'https://www.instagram.com/martabeautyzurich'
const WA_NUMBER = '41766717753'
const ADDRESS = 'Pfäffikon ZH, Schweiz'
const MAP_QUERY = encodeURIComponent('Pfäffikon ZH, Switzerland')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return { title: t('contactTitle'), description: t('contactDescription') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const waMessage = encodeURIComponent(
    locale === 'it' ? 'Ciao Marta! Ho una domanda 🌸' : 'Hi Marta! I have a question 🌸'
  )

  return (
    <div className="pt-24 pb-20">
      <section className="bg-parchment px-6 py-16 lg:py-24 text-center">
        <p className="section-label mb-3">{t('label')}</p>
        <h1 className="font-serif text-display-lg font-light text-ink mb-4">{t('heading')}</h1>
        <p className="font-sans text-base text-secondary max-w-lg mx-auto leading-relaxed">{t('intro')}</p>
      </section>

      <section className="max-w-2xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="font-serif text-2xl font-light text-ink mb-6">{t('infoHeading')}</h2>

        <ul className="flex flex-col gap-6">
          <li className="flex items-start gap-3">
            <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">⊙</span>
            <div>
              <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">{t('addressLabel')}</p>
              <p className="font-sans text-sm text-ink">{ADDRESS}</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">↗</span>
            <div>
              <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">{t('phoneLabel')}</p>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="font-sans text-sm text-ink hover:text-accent transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">✦</span>
            <div>
              <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">WhatsApp</p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-ink hover:text-accent transition-colors"
              >
                {t('whatsappCta')}
              </a>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">◇</span>
            <div>
              <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">Instagram</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-ink hover:text-accent transition-colors">
                @martabeautyzurich
              </a>
            </div>
          </li>
        </ul>

        <div className="relative mt-8 h-[280px] overflow-hidden rounded-card border border-border bg-bg-muted">
          <iframe
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            title="Pfäffikon ZH on Google Maps"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 rounded-full bg-white/95 px-4 py-2 font-sans text-xs font-medium text-ink shadow-sm transition-colors hover:text-accent"
          >
            {locale === 'it' ? 'Apri in Google Maps' : 'Open in Google Maps'} ↗
          </a>
        </div>

        <p className="mt-3 font-sans text-xs text-secondary">{t('serviceArea')}</p>
      </section>

      <section className="bg-ink text-white text-center py-12 px-6">
        <p className="font-serif text-xl font-light mb-4">{t('bookingStrip')}</p>
        <Link href={`/${locale}/booking`} className="btn-outline border-white text-white hover:bg-white hover:text-ink">
          {t('bookingStripCta')}
        </Link>
      </section>
    </div>
  )
}
