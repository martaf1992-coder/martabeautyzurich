# Netlify Environment Variables

Add these in Netlify under:

`Site configuration` -> `Environment variables`

Use the same values for Production, Deploy previews, and Branch deploys unless you intentionally want different test values.

## Required

| Variable | Example value | Used for |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://martabeautyzurich.com` | Builds correct absolute URLs for redirects and Stripe checkout fallback. |
| `NEXT_PUBLIC_CALENDLY_30MIN_URL` | `https://calendly.com/marta-f1992/30min` | Booking calendar for 30 minute treatments. |
| `NEXT_PUBLIC_CALENDLY_45MIN_URL` | `https://calendly.com/marta-f1992/45min` | Booking calendar for 45 minute treatments. |
| `NEXT_PUBLIC_CALENDLY_60MIN_URL` | `https://calendly.com/marta-f1992/60min` | Booking calendar for 60 minute treatments. |
| `NEXT_PUBLIC_CALENDLY_90MIN_URL` | `https://calendly.com/marta-f1992/90min` | Booking calendar for 90 minute treatments. |
| `RESEND_API_KEY` | `re_...` | Sends contact form emails through Resend. |

## Required If Stripe Checkout Is Enabled

| Variable | Example value | Used for |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Creates Stripe checkout sessions. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook verification, if/when webhook handling is enabled. |

## Optional

| Variable | Example value | Used for |
|---|---|---|
| `CONTACT_FROM_EMAIL` | `Marta Beauty Zurich <hello@martabeautyzurich.com>` | Sender address for contact form emails. If omitted, the app uses `Marta Beauty Zurich <onboarding@resend.dev>`. |

## Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser and must not contain secrets.
- `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` are server-side secrets. Never expose them in public code.
- The Calendly event URLs should point to separate event types with the correct durations: 30, 45, 60, and 90 minutes.
- For Zurich-based appointments, lock the timezone to Zurich inside each Calendly event type.
- The local reviews feature currently writes to `data/reviews.json`. On Netlify/serverless hosting, filesystem writes are not persistent, so production reviews should be moved to a database before relying on them live.
