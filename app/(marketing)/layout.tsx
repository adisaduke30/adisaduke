import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Adisa Duke - Director of Photography',
  description: 'Award-winning Director of Photography specializing in branded content and editorial work. Featured clients include Nike, Puma, HP, and Vimeo.',
  keywords: ['director of photography', 'dp', 'cinematographer', 'video production', 'branded content', 'commercial', 'editorial'],
  openGraph: {
    title: 'Adisa Duke - Director of Photography',
    description: 'Award-winning Director of Photography specializing in branded content and editorial work.',
    type: 'website',
    images: ['/og-image.jpg'],
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="light min-h-screen bg-background font-karla">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
