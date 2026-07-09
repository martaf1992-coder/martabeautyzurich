import type { Metadata } from 'next'
import ReviewCard from '@/components/ui/ReviewCard'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviews' })

  return {
    title: `${t('heading')} - Marta Beauty Zurich`,
    robots: 'noindex',
  }
}

export default function ReviewPage() {
  return (
    <main className="pt-24 bg-white min-h-screen">
      <ReviewCard />
    </main>
  )
}
