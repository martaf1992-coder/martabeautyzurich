import 'server-only'

type TurnstileResult = {
  success?: boolean
  action?: string
}

export async function verifyReviewCaptcha(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not configured.')
    return { ok: false as const, configurationError: true as const }
  }

  if (!token) return { ok: false as const, configurationError: false as const }

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store',
    })
    const result = await response.json() as TurnstileResult
    return {
      ok: response.ok && result.success === true && result.action === 'submit-review',
      configurationError: false as const,
    }
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return { ok: false as const, configurationError: false as const }
  }
}
