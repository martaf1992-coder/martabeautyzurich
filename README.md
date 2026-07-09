# Marta Beauty Zurich — Website

Next.js 14 website for **Marta Beauty Zurich**, featuring:
- Bilingual IT/EN routing via next-intl
- Tailwind CSS with brand design tokens
- Calendly booking embed (placeholder — see `app/[locale]/booking/page.tsx`)
- Stripe checkout for online programs (placeholder — see `app/api/checkout/route.ts`)
- GDPR-compliant cookie banner
- Google review CTA system with a stable `/review` redirect for QR cards

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/it` (default locale).  
Toggle language with the `/en` prefix or the language switcher in the Navbar.

## Project Structure

```
app/
├── [locale]/          # All pages under locale routing
│   ├── page.tsx       # Home
│   ├── treatments/    # In-person treatments
│   ├── programs/      # Online wellness programs
│   ├── postpartum/    # Post-partum journey
│   ├── about/         # About Marta
│   ├── booking/       # Booking page + success/cancelled
│   ├── contact/       # Contact page with form
│   ├── privacy/       # Privacy policy (placeholder)
│   └── cookie-policy/ # Cookie policy (placeholder)
├── api/
│   └── checkout/      # Stripe checkout session API route
components/
├── layout/            # Navbar, Footer, WhatsAppButton, CookieBanner
└── ui/                # TreatmentCard, ProgramTierCard, TeamCard, ...
messages/
├── it.json            # Italian strings (default locale)
└── en.json            # English strings
public/images/         # Logo, slogan, treatment images (add your own)
```

## Configuration TODOs

| File | What to fill in |
|------|----------------|
| `components/layout/WhatsAppButton.tsx` | `WA_NUMBER` — your WhatsApp number |
| `components/layout/Footer.tsx` | Email, phone, Instagram link |
| `app/[locale]/contact/page.tsx` | `CONTACT_EMAIL`, `CONTACT_PHONE`, `INSTAGRAM_URL` |
| `app/[locale]/booking/page.tsx` | Replace Calendly placeholder with embed |
| `app/api/checkout/route.ts` | Stripe `PRICE_IDS` — create products in Stripe dashboard |
| `.env.local` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` |
| `.env.local` | `NEXT_PUBLIC_GOOGLE_REVIEW_URL` from Google Business Profile |
| `app/[locale]/privacy/page.tsx` | Real Privacy Policy (DSG/GDPR compliant) |
| `app/[locale]/cookie-policy/page.tsx` | Real Cookie Policy |
| `public/images/` | Add treatment, portrait, hero photos |

## Google Reviews

Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` in `.env.local` to the direct review link from Google Business Profile.

Use the site URL `/it/review` or `/en/review` for printed QR cards. Those pages redirect to the configured Google review URL, so the printed QR code can stay the same if the Google link changes later.

## Deployment

Recommended: **Vercel** (zero-config with Next.js).

```bash
npm run build   # verify build before deploying
```

Add all `.env.local` values as environment variables in the Vercel project settings.
