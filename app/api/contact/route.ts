import { NextRequest, NextResponse } from 'next/server'

const CONTACT_TO_EMAIL = 'marta.f1992@gmail.com'
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'Marta Beauty Zurich <onboarding@resend.dev>'

const subjectLabels: Record<string, string> = {
  generalInquiry: 'General inquiry',
  bookingHelp: 'Help with booking',
  programInfo: 'Online programs',
  postpartum: 'Post-partum journey',
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'Contact email is not configured. Set RESEND_API_KEY in .env.local.' },
      { status: 503 }
    )
  }

  const formData = await req.formData()
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !isEmail(email) || !subject || !message) {
    return NextResponse.json({ error: 'Invalid contact form submission.' }, { status: 400 })
  }

  const subjectLabel = subjectLabels[subject] ?? subject
  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : 'Not provided'}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Marta Beauty Zurich contact: ${subjectLabel}`,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('[contact] resend error:', body)
    return NextResponse.json({ error: 'Could not send contact email.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
