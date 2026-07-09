import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Turbopack alias for next-intl config (Next.js 16 moved this from experimental.turbo to top-level)
  turbopack: {
    resolveAlias: {
      'next-intl/config': './i18n/request.ts',
    },
  },
}

export default withNextIntl(nextConfig)
