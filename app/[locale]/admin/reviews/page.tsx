import type { Metadata } from 'next'
import ReviewAdmin from '@/components/ui/ReviewAdmin'

export const metadata: Metadata = {
  title: 'Gestione recensioni - Marta Beauty Zurich',
  robots: { index: false, follow: false },
}

export default async function ReviewAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <main className="min-h-screen bg-parchment px-6 pb-20 pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="section-label mb-3">Area riservata</p>
        <h1 className="mb-3 font-serif text-display-md font-light text-ink">Gestione recensioni</h1>
        <p className="mb-8 font-sans text-sm leading-relaxed text-secondary">
          Approva le nuove recensioni prima della pubblicazione oppure elimina quelle indesiderate.
        </p>
        <ReviewAdmin locale={locale} />
      </div>
    </main>
  )
}
