'use client'

import type { Locale } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CONTACT_PHONE = '+41 76 671 77 53'
const INSTAGRAM_URL = 'https://www.instagram.com/martabeautyzurich'

interface Props {
  locale: Locale
}

export default function Footer({ locale }: Props) {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const pathname = usePathname()

  const links = [
    { href: `/${locale}/programs`, label: nav('programs') },
    { href: `/${locale}/treatments`, label: nav('treatments') },
    { href: `/${locale}/postpartum`, label: nav('postpartum') },
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/contact`, label: nav('contact') },
    { href: `/${locale}/booking`, label: nav('book') },
  ]

  const pathForLocale = (targetLocale: Locale) => {
    const localizedPath = pathname.replace(/^\/(it|en)(?=\/|$)/, `/${targetLocale}`)
    return localizedPath === pathname ? `/${targetLocale}` : localizedPath
  }

  return (
    <footer className="bg-parchment border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href={`/${locale}`} aria-label="Marta Beauty Zurich — home">
              <Image
                src="/images/logo.jpeg"
                alt="Marta Beauty Zurich"
                width={64}
                height={80}
                className="h-14 w-auto"
              />
            </Link>
            <p className="font-serif text-lg font-light italic text-ink">{t('tagline')}</p>
            <p className="font-sans text-sm text-secondary">{t('address')}</p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              className="font-sans text-sm text-secondary hover:text-accent transition-colors"
            >
              {CONTACT_PHONE}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-secondary hover:text-accent transition-colors"
            >
              @martabeautyzurich
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="section-label mb-5">{t('links')}</p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="font-sans text-sm text-secondary hover:text-ink transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Language + booking CTA */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="section-label mb-3">{locale === 'it' ? 'Lingua' : 'Language'}</p>
              <div className="flex gap-3">
                {(['it', 'en'] as Locale[]).map((l) => (
                  <Link
                    key={l}
                    href={pathForLocale(l)}
                    className={`font-sans text-sm font-medium tracking-widest transition-colors ${
                      locale === l ? 'text-ink' : 'text-secondary hover:text-ink'
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
            <Link href={`/${locale}/booking`} className="btn-primary self-start">
              {nav('book')}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-sans text-xs text-secondary">{t('rights')}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="font-sans text-xs text-secondary hover:text-ink transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/cookie-policy`} className="font-sans text-xs text-secondary hover:text-ink transition-colors">
              {t('cookie')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
