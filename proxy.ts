import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Run on all paths except static files, api routes, and Next internals
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
