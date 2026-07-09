'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { LocalReview } from '@/lib/localReviews'

interface Props {
  compact?: boolean
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <div className="flex justify-center gap-1 text-accent" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true" className={star <= rating ? 'opacity-100' : 'opacity-25'}>
          &#9733;
        </span>
      ))}
    </div>
  )
}

export default function ReviewCard({ compact = false }: Props) {
  const t = useTranslations('reviews')
  const [reviews, setReviews] = useState<LocalReview[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [rating, setRating] = useState(5)
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    fetch('/api/reviews')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (mounted && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
          setActiveIndex(0)
        }
      })
      .catch(() => {
        if (mounted) setError(t('errors.load'))
      })

    return () => {
      mounted = false
    }
  }, [t])

  const activeReview = reviews[activeIndex]

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? reviews.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current === reviews.length - 1 ? 0 : current + 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setState('loading')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      message: String(formData.get('message') ?? ''),
      rating,
    }

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      setState('error')
      setError(t('errors.submit'))
      return
    }

    const data = await response.json()
    if (data.review) {
      setReviews((current) => [data.review, ...current])
      setActiveIndex(0)
    }

    form.reset()
    setRating(5)
    setState('success')
  }

  const content = (
    <>
      <p className="section-label mb-3">{t('label')}</p>
      <h2 id={compact ? undefined : 'reviews-heading'} className="font-serif text-display-md font-light text-ink mb-4">
        {t('heading')}
      </h2>
      <p className="font-sans text-sm text-secondary leading-relaxed max-w-xl mx-auto mb-8">
        {t('text')}
      </p>

      <div className={`${compact ? 'grid gap-8 text-left' : 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-stretch text-left'}`}>
        <div className="border border-border rounded-card bg-bg-muted p-6 sm:p-8 flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="section-label mb-2">{t('carouselLabel')}</p>
              <p className="font-sans text-sm text-secondary">
                {reviews.length ? t('summary', { count: reviews.length, rating: averageRating.toFixed(1) }) : t('empty')}
              </p>
            </div>
            {reviews.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="h-10 w-10 rounded-full border border-border bg-white text-ink transition hover:border-accent"
                  aria-label={t('previous')}
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="h-10 w-10 rounded-full border border-border bg-white text-ink transition hover:border-accent"
                  aria-label={t('next')}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

          {activeReview ? (
            <article className="flex flex-1 flex-col justify-between text-center">
              <div>
                <Stars rating={activeReview.rating} label={t('ratingLabel', { rating: activeReview.rating })} />
                <blockquote className="mt-6 font-serif text-2xl sm:text-3xl leading-snug text-ink">
                  "{activeReview.message}"
                </blockquote>
              </div>
              <footer className="mt-8 font-sans text-sm text-secondary">
                {activeReview.name}
              </footer>
            </article>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center font-sans text-sm text-secondary">
              {error || t('empty')}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="border border-border rounded-card bg-white p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <p className="section-label mb-2">{t('formLabel')}</p>
            <h3 className="font-serif text-2xl text-ink">{t('formHeading')}</h3>
          </div>

          <div>
            <label htmlFor={compact ? 'review-name-compact' : 'review-name'} className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
              {t('nameLabel')}
            </label>
            <input
              id={compact ? 'review-name-compact' : 'review-name'}
              name="name"
              type="text"
              minLength={2}
              maxLength={80}
              required
              className="w-full border border-border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <fieldset>
            <legend className="font-sans text-xs text-secondary uppercase tracking-widest mb-2 block">
              {t('rating')}
            </legend>
            <div className="flex gap-2" role="radiogroup" aria-label={t('rating')}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`h-10 w-10 rounded-full border font-sans text-sm transition ${
                    value <= rating
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-white text-secondary hover:border-accent'
                  }`}
                  aria-pressed={value === rating}
                  aria-label={t('ratingLabel', { rating: value })}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={compact ? 'review-message-compact' : 'review-message'} className="font-sans text-xs text-secondary uppercase tracking-widest mb-1 block">
              {t('messageLabel')}
            </label>
            <textarea
              id={compact ? 'review-message-compact' : 'review-message'}
              name="message"
              rows={5}
              minLength={10}
              maxLength={700}
              required
              className="w-full border border-border rounded px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent transition resize-none"
            />
          </div>

          {state === 'success' && (
            <p className="font-sans text-sm text-secondary">{t('success')}</p>
          )}
          {state === 'error' && (
            <p className="font-sans text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'loading' ? t('submitting') : t('submit')}
          </button>
        </form>
      </div>
    </>
  )

  if (compact) {
    return (
      <div className="mt-8 border-t border-border pt-8 text-center">
        {content}
      </div>
    )
  }

  return (
    <section className="bg-white py-16 lg:py-20 px-6 text-center" aria-labelledby="reviews-heading">
      <div className="max-w-5xl mx-auto">
        {content}
      </div>
    </section>
  )
}
