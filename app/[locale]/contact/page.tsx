import ContactForm from '@/components/ui/ContactForm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const CONTACT_PHONE = '+41 76 671 77 53'
const INSTAGRAM_URL = 'https://www.instagram.com/martabeautyzurich'
const WA_NUMBER = '41766717753'
const ADDRESS = 'Pfaffikon ZH, Schweiz'

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
      {/* Header */}
      <section className="bg-parchment px-6 py-16 lg:py-24 text-center">
        <p className="section-label mb-3">{t('label')}</p>
        <h1 className="font-serif text-display-lg font-light text-ink mb-4">{t('heading')}</h1>
        <p className="font-sans text-base text-secondary max-w-lg mx-auto leading-relaxed">{t('intro')}</p>
      </section>

      {/* Split layout */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left — contact info */}
        <div>
          <h2 className="font-serif text-2xl font-light text-ink mb-6">{t('infoHeading')}</h2>

          <ul className="flex flex-col gap-6">
            {/* Address */}
            <li className="flex items-start gap-3">
              <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">⊙</span>
              <div>
                <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">{t('addressLabel')}</p>
                <p className="font-sans text-sm text-ink">{ADDRESS}</p>
              </div>
            </li>

            {/* Phone */}
            <li className="flex items-start gap-3">
              <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">↗</span>
              <div>
                <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">{t('phoneLabel')}</p>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="font-sans text-sm text-ink hover:text-accent transition-colors">
                  {CONTACT_PHONE}
                </a>
              </div>
            </li>

            {/* WhatsApp */}
            <li className="flex items-start gap-3">
              <span className="text-accent text-lg leading-none mt-0.5" aria-hidden="true">✦</span>
              <div>
                <p className="font-sans text-xs text-secondary uppercase tracking-widest mb-0.5">WhatsApp</p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans text-sm text-ink hover:text-accent transition-colors"
                >
                  {t('whatsappCta')}
                </a>
              </div>
            </li>

            {/* Instagram */}
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

          {/* Map placeholder */}
          <div
            className="mt-8 rounded-card border border-border bg-bg-muted h-[200px] flex items-center justify-center overflow-hidden"
            aria-label={t('mapPlaceholder')}
          >
            {/*
              REPLACE: paste Google Maps iframe here, e.g.:
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%" height="200" style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            */}
            <p className="font-sans text-xs text-secondary">{t('mapPlaceholder')}</p>
          </div>

          <p className="mt-3 font-sans text-xs text-secondary">{t('serviceArea')}</p>
        </div>

        {/* Right — contact form */}
        <div>
          <h2 className="font-serif text-2xl font-light text-ink mb-6">{t('formHeading')}</h2>
          <ContactForm />
        </div>
      </section>

      {/* Booking prompt strip */}
      <section className="bg-ink text-white text-center py-12 px-6">
        <p className="font-serif text-xl font-light mb-4">{t('bookingStrip')}</p>
        <Link href={`/${locale}/booking`} className="btn-outline border-white text-white hover:bg-white hover:text-ink">
          {t('bookingStripCta')}
        </Link>
      </section>
    </div>
  )
}
