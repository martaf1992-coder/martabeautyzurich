# Marta Beauty Zurich — Website

Next.js 14 website for **Marta Beauty Zurich**, featuring:
- Bilingual IT/EN routing via next-intl
- Tailwind CSS with brand design tokens
- Calendly booking embed (placeholder — see `app/[locale]/booking/page.tsx`)
- Stripe checkout for online programs (placeholder — see `app/api/checkout/route.ts`)
- GDPR-compliant cookie banner
- Local review form and carousel with a stable `/review` page for QR cards

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
| `.env.local` | `NEXT_PUBLIC_CALENDLY_30MIN_URL`, `NEXT_PUBLIC_CALENDLY_45MIN_URL`, `NEXT_PUBLIC_CALENDLY_60MIN_URL`, `NEXT_PUBLIC_CALENDLY_90MIN_URL` |
| `app/api/checkout/route.ts` | Stripe `PRICE_IDS` — create products in Stripe dashboard |
| `.env.local` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` |
| `app/[locale]/privacy/page.tsx` | Real Privacy Policy (DSG/GDPR compliant) |
| `app/[locale]/cookie-policy/page.tsx` | Real Cookie Policy |
| `public/images/` | Add treatment, portrait, hero photos |

## Local Reviews

Reviews are stored in `data/reviews.json` through `/api/reviews` and displayed in the carousel on the home page and review page.

Use `/it/review` or `/en/review` for printed QR cards. On a serverless host such as Vercel, filesystem writes are not persistent, so replace the JSON file storage with a database before collecting production reviews.

## Calendly Booking

Create separate Calendly event types for 30, 45, 60, and 90 minute treatments, then set the matching `NEXT_PUBLIC_CALENDLY_*_URL` values. The booking form chooses the event type from the selected treatment duration and passes `Europe/Zurich` as the calendar timezone.

For in-person Zurich appointments, lock the timezone to Zurich inside each Calendly event type. Calendly may still display timezone information inside its iframe; that display is controlled by Calendly.

## Deployment

Recommended: **Vercel** (zero-config with Next.js).

```bash
npm run build   # verify build before deploying
```

Add all `.env.local` values as environment variables in the Vercel project settings.
