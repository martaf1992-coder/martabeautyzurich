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
| `NEXT_PUBLIC_CALENDLY_50MIN_URL` | `https://calendly.com/marta-f1992/50min` | Booking calendar for 50 minute treatments. |
| `NEXT_PUBLIC_CALENDLY_60MIN_URL` | `https://calendly.com/marta-f1992/60min` | Booking calendar for 60 minute treatments. |
| `NEXT_PUBLIC_CALENDLY_90MIN_URL` | `https://calendly.com/marta-f1992/90min` | Booking calendar for 90 minute treatments. |
| `RESEND_API_KEY` | `re_...` | Sends contact form emails through Resend. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAA...` | Displays Cloudflare Turnstile on the public review form. |
| `TURNSTILE_SECRET_KEY` | `0x4AAAA...` | Verifies review challenges on the server. Keep this secret. |
| `REVIEW_ADMIN_USERNAME` | `marta` | Username for the private review administration page. |
| `REVIEW_ADMIN_PASSWORD` | A long unique password | Password for Marta's review administration page. Keep this secret. |
| `REVIEW_ADMIN_SESSION_SECRET` | At least 32 random characters | Signs the administrator session cookie. Keep this secret. |

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
- `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TURNSTILE_SECRET_KEY`, `REVIEW_ADMIN_PASSWORD`, and `REVIEW_ADMIN_SESSION_SECRET` are server-side secrets. Never expose them in public code.
- Create a Turnstile widget for `martabeautyzurich.com` in Cloudflare, then copy its site key and secret into Netlify.
- Generate the session secret locally with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- Marta's review queue is available at `/it/admin/reviews` (or `/en/admin/reviews`). New submissions stay hidden until she approves them.
- The Calendly event URLs should point to separate active event types with the correct durations: 30, 45, 50, 60, and 90 minutes.
- For Zurich-based appointments, lock the timezone to Zurich inside each Calendly event type.
- Reviews use Netlify Blobs automatically inside Netlify functions. Local development continues to use `data/reviews.json`.
