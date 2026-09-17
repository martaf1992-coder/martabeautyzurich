'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { LocalReview } from '@/lib/localReviews'

export default function ReviewAdmin({ locale }: { locale: string }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [reviews, setReviews] = useState<LocalReview[]>([])
  const [csrfToken, setCsrfToken] = useState('')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const loadReviews = async () => {
    const response = await fetch('/api/admin/reviews', { cache: 'no-store' })
    if (response.status === 401) {
      setAuthenticated(false)
      setReviews([])
      setCsrfToken('')
      return
    }
    if (!response.ok) {
      setAuthenticated(false)
      setError('Impossibile caricare le recensioni.')
      return
    }
    const data = await response.json()
    setAuthenticated(true)
    setReviews(Array.isArray(data.reviews) ? data.reviews : [])
    setCsrfToken(String(data.csrfToken ?? ''))
  }

  useEffect(() => {
    void loadReviews()
  }, [])

  const pendingCount = useMemo(
    () => reviews.filter((review) => review.status === 'pending').length,
    [reviews]
  )

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const response = await fetch('/api/admin/reviews/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: String(formData.get('username') ?? ''),
        password: String(formData.get('password') ?? ''),
      }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setError(data?.error || 'Accesso non riuscito.')
      return
    }
    form.reset()
    await loadReviews()
  }

  const mutate = async (id: string, method: 'PATCH' | 'DELETE') => {
    setBusyId(id)
    setError('')
    try {
      const response = await fetch('/api/admin/reviews', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ id }),
      })
      if (response.status === 401) {
        setAuthenticated(false)
        setReviews([])
        return
      }
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Operazione non riuscita.')
      setReviews(Array.isArray(data.reviews) ? data.reviews : [])
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Operazione non riuscita.')
    } finally {
      setBusyId('')
    }
  }

  const logout = async () => {
    await fetch('/api/admin/reviews/logout', {
      method: 'POST',
      headers: { 'X-CSRF-Token': csrfToken },
    })
    setAuthenticated(false)
    setReviews([])
    setCsrfToken('')
  }

  if (authenticated === null) {
    return <p className="font-sans text-sm text-secondary">Caricamento...</p>
  }

  if (!authenticated) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm rounded-card border border-border bg-white p-6 sm:p-8 space-y-5">
        <div>
          <label htmlFor="admin-username" className="mb-1 block font-sans text-xs uppercase tracking-widest text-secondary">Utente</label>
          <input id="admin-username" name="username" defaultValue="marta" autoComplete="username" required className="w-full rounded border border-border bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-1 block font-sans text-xs uppercase tracking-widest text-secondary">Password</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="w-full rounded border border-border bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        {error && <p className="font-sans text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">Accedi</button>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-sans text-sm text-secondary">
          {pendingCount} da approvare · {reviews.length} totali
        </p>
        <div className="flex gap-3">
          <a href={`/${locale}`} className="font-sans text-sm text-secondary underline">Vai al sito</a>
          <button type="button" onClick={logout} className="font-sans text-sm text-secondary underline">Esci</button>
        </div>
      </div>

      {error && <p className="rounded border border-red-200 bg-red-50 p-3 font-sans text-sm text-red-700">{error}</p>}

      {reviews.length === 0 ? (
        <p className="rounded-card border border-border bg-white p-8 text-center font-sans text-sm text-secondary">Nessuna recensione.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-card border border-border bg-white p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl text-ink">{review.name}</p>
                  <p className="font-sans text-xs text-secondary">
                    {'★'.repeat(review.rating)} · {new Date(review.createdAt).toLocaleString('it-CH')}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 font-sans text-xs ${review.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  {review.status === 'pending' ? 'Da approvare' : 'Pubblicata'}
                </span>
              </div>
              <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{review.message}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {review.status === 'pending' && (
                  <button type="button" disabled={busyId === review.id} onClick={() => mutate(review.id, 'PATCH')} className="btn-primary disabled:opacity-50">
                    Approva e pubblica
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === review.id}
                  onClick={() => window.confirm('Eliminare definitivamente questa recensione?') && mutate(review.id, 'DELETE')}
                  className="rounded border border-red-300 px-5 py-3 font-sans text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Elimina
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
