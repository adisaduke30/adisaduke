import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VideoGrid } from '@/components/marketing/VideoGrid'
import { CTASection } from '@/components/marketing/CTASection'
import { VideoObjectSchema } from '@/components/StructuredData'
import portfolioData from '@/content-migration/inventory.json'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Featured Reel - Award-Winning Cinematography | Adisa Duke',
  description: 'Watch the featured cinematography reel from Adisa Duke, Director of Photography. Showcasing award-winning work with Nike, Puma, HP, and Vimeo. Brand video production and editorial storytelling.',
  keywords: ['cinematography reel', 'director of photography reel', 'DP showreel', 'brand video production', 'commercial cinematography', 'Nike cinematographer', 'Puma video production'],
  openGraph: {
    title: 'Featured Reel - Award-Winning Cinematography | Adisa Duke',
    description: 'Watch award-winning cinematography work featuring Nike, Puma, HP, and Vimeo. Professional brand video production and editorial storytelling.',
    url: 'https://adisaduke.vercel.app/reel',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-reel.jpg',
        width: 1200,
        height: 630,
        alt: 'Adisa Duke - Featured Cinematography Reel',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured Reel - Award-Winning Cinematography | Adisa Duke',
    description: 'Watch award-winning cinematography work featuring Nike, Puma, HP, and Vimeo.',
    images: ['/og/og-reel.jpg'],
  },
}

export default function ReelPage() {
  // Curate best work for the reel - hand-picked best videos with exact titles
  const reelVideos = [
    portfolioData.portfolio.brandedContent.find((v) => v.title === 'Nike Black History Month Recap 2020'),
    portfolioData.portfolio.brandedContent.find((v) => v.title === 'HP Sprocket 3x4'),
    portfolioData.portfolio.brandedContent.find((v) => v.title === 'Puma Suede Classics: Men\'s'),
    portfolioData.portfolio.editorial.find((v) => v.title === 'Vimeo Stories in Place'),
    portfolioData.portfolio.editorial.find((v) => v.title === 'DIOP'),
  ].filter((v) => v && v.vimeoId) as any[]

  return (
    <div className="min-h-screen">
      {/* Video Schema for Reel */}
      {reelVideos.map((video) => {
        const videoId = video.vimeoId || ('youtubeId' in video && video.youtubeId)
        if (!videoId) return null

        const embedUrl = video.vimeoId
          ? `https://player.vimeo.com/video/${video.vimeoId}`
          : `https://www.youtube.com/embed/${'youtubeId' in video ? video.youtubeId : ''}`

        const thumbnailUrl = video.vimeoId
          ? `https://vumbnail.com/${video.vimeoId}.jpg`
          : `https://img.youtube.com/vi/${'youtubeId' in video ? video.youtubeId : ''}/maxresdefault.jpg`

        return (
          <VideoObjectSchema
            key={String(videoId)}
            name={video.title}
            description={`${video.role} for ${'client' in video ? video.client : ('company' in video ? video.company : 'project')}. Featured in cinematography reel showcasing ${video.category} video production.`}
            thumbnailUrl={thumbnailUrl}
            embedUrl={embedUrl}
            creator={{
              name: "Adisa Duke",
              jobTitle: "Director of Photography & Cinematographer",
            }}
          />
        )
      })}

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Featured Reel
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A curated selection of the best cinematography work showcasing storytelling through the lens
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Nike</span>
            <span>•</span>
            <span>Puma</span>
            <span>•</span>
            <span>HP</span>
            <span>•</span>
            <span>Vimeo</span>
          </div>
        </div>
      </section>

      {/* Featured Videos Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <VideoGrid videos={reelVideos} showAll={true} />
        </div>
      </section>

      {/* See All Work CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-accent/5 border border-border/40 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Want to see more?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore the full portfolio of branded content, editorial work, and short form videos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/film">
                <Button size="lg" className="group">
                  Branded Content
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/edit">
                <Button size="lg" variant="outline" className="group">
                  Editorial Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Let's Create Something Exceptional"
        description="Ready to bring your vision to life? Get in touch to discuss your next project."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryLabel="View All Work"
        secondaryHref="/film"
      />
    </div>
  )
}
