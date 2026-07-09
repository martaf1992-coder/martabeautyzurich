import CookieBanner from '@/components/layout/CookieBanner'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { locales, type Locale } from '@/i18n/routing'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: { default: t('siteName'), template: `%s | ${t('siteName')}` },
    description: t('homeDescription'),
    openGraph: {
      siteName: t('siteName'),
      locale,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { it: '/it', en: '/en' },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar locale={locale as Locale} />
      <main>{children}</main>
      <Footer locale={locale as Locale} />
      <WhatsAppButton locale={locale as Locale} />
      <CookieBanner />
    </NextIntlClientProvider>
  )
}
