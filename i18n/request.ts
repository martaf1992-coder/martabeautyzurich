import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    throw new Error(`Unsupported locale: ${locale}`)
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
