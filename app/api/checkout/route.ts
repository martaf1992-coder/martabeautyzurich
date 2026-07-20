import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// TODO: add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to your .env.local file
// Never commit real secret keys to version control
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
})

// TODO: replace with your real Stripe Price IDs after creating products in the Stripe dashboard
const PRICE_IDS: Record<string, string> = {
  essential: 'price_REPLACE_ESSENTIAL',
  integrated: 'price_REPLACE_INTEGRATED',
  luxury: 'price_REPLACE_LUXURY',
  integratedMum: 'price_REPLACE_INTEGRATED_MUM',
  luxuryMum: 'price_REPLACE_LUXURY_MUM',
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.' },
      { status: 503 }
    )
  }

  let body: { priceKey?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { priceKey, locale = 'it' } = body

  if (!priceKey || !PRICE_IDS[priceKey]) {
    return NextResponse.json({ error: 'Unknown price key.' }, { status: 400 })
  }

  if (PRICE_IDS[priceKey].includes('REPLACE')) {
    return NextResponse.json(
      { error: 'Checkout for this program is not configured yet.' },
      { status: 503 }
    )
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: PRICE_IDS[priceKey], quantity: 1 }],
      success_url: `${origin}/${locale}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/booking/cancelled`,
      locale: locale === 'it' ? 'it' : 'en',
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not create checkout session.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe] checkout session error:', err)
    return NextResponse.json({ error: 'Payment service unavailable.' }, { status: 500 })
  }
}
