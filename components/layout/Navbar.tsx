'use client'

import type { Locale } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  locale: Locale
}

export default function Navbar({ locale }: Props) {
  const t = useTranslations('nav')
  const currentLocale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Derive the alternate locale path
  const otherLocale: Locale = currentLocale === 'it' ? 'en' : 'it'
  const otherLocalePath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navLinks = [
    { href: `/${locale}/treatments`, label: t('treatments') },
    { href: `/${locale}/programs`, label: t('programs') },
    { href: `/${locale}/postpartum`, label: t('postpartum') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-none' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0" aria-label="Marta Beauty Zurich — home">
              <Image
                src="/images/logo2.jpg"
                alt="Marta Beauty Zurich"
                width={120}
                height={120}
                className="h-16 w-auto lg:h-20"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`font-sans text-sm font-medium tracking-wide transition-colors duration-150 ${
                    pathname === href
                      ? 'text-accent border-b border-accent pb-0.5'
                      : 'text-ink hover:text-accent'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right cluster — desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href={otherLocalePath}
                className="font-sans text-xs font-medium tracking-widest text-secondary hover:text-ink transition-colors"
                aria-label={`Switch to ${otherLocale.toUpperCase()}`}
              >
                {otherLocale.toUpperCase()}
              </Link>
              <Link href={`/${locale}/booking`} className="btn-primary text-sm py-2.5 px-6">
                {t('book')}
              </Link>
            </div>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
            >
              <span className={`block w-6 h-px bg-ink transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-6 h-px bg-ink transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-px bg-ink transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex-1 flex flex-col justify-center px-10 gap-8 pt-20">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-serif text-display-md text-ink hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="divider" />
          <div className="flex items-center gap-6">
            <Link
              href={otherLocalePath}
              className="font-sans text-sm font-medium tracking-widest text-secondary hover:text-ink transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              {t('book')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
