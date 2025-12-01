import { VideoGrid } from '@/components/marketing/VideoGrid'
import { CTASection } from '@/components/marketing/CTASection'
import { VideoObjectSchema } from '@/components/StructuredData'
import portfolioData from '@/content-migration/inventory.json'
import { Camera } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Video Production & Commercial Cinematography | Adisa Duke',
  description: 'Professional brand video production and commercial cinematography services. Featured work with Nike, Puma, HP, and Vimeo. Director of Photography specializing in branded content and advertising.',
  keywords: ['brand video production', 'commercial cinematography', 'advertising cinematographer', 'Nike video production', 'Puma commercial', 'branded content production', 'corporate video production', 'commercial director of photography'],
  openGraph: {
    title: 'Brand Video Production & Commercial Cinematography | Adisa Duke',
    description: 'Professional branded content and commercial cinematography. Work featured with Nike, Puma, HP, Vimeo. 12 projects for major brands.',
    url: 'https://adisaduke.vercel.app/film',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-film.jpg',
        width: 1200,
        height: 630,
        alt: 'Adisa Duke - Brand Video Production Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Video Production & Commercial Cinematography | Adisa Duke',
    description: 'Professional branded content with Nike, Puma, HP, Vimeo. 12 projects for major brands.',
    images: ['/og/og-film.jpg'],
  },
}

export default function BrandedContentPage() {
  // Filter all branded content videos
  const brandedVideos = portfolioData.portfolio.brandedContent.filter((v) => v.vimeoId !== null)

  // Group videos by client for organized display
  const nikeVideos = brandedVideos.filter((v) => v.client === 'Nike')
  const pumaVideos = brandedVideos.filter((v) => v.client === 'Puma')
  const otherVideos = brandedVideos.filter((v) => v.client !== 'Nike' && v.client !== 'Puma')

  return (
    <div className="min-h-screen">
      {/* Video Schema for Branded Content */}
      {brandedVideos.slice(0, 6).map((video) => {
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
            description={`${video.role} for ${video.client}. Commercial ${video.category} video production.`}
            thumbnailUrl={thumbnailUrl}
            embedUrl={embedUrl}
            uploadDate="2024-01-01"
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
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-border/40 rounded-full px-4 py-2 mb-6">
            <Camera className="h-4 w-4" />
            <span className="text-sm font-medium">Branded Content</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Commercial & Branded Work
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Crafting compelling visual narratives for brands that demand excellence
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">{brandedVideos.length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">4</div>
              <div className="text-sm text-muted-foreground">Major Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">DP</div>
              <div className="text-sm text-muted-foreground">Primary Role</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nike Section */}
      {nikeVideos.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Nike</h2>
              <p className="text-lg text-muted-foreground">
                Premium brand storytelling for one of the world's most iconic sportswear companies
              </p>
            </div>
            <VideoGrid videos={nikeVideos} showAll={true} />
          </div>
        </section>
      )}

      {/* Puma Section */}
      {pumaVideos.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Puma</h2>
              <p className="text-lg text-muted-foreground">
                Bold visual campaigns showcasing Puma's heritage and contemporary style
              </p>
            </div>
            <VideoGrid videos={pumaVideos} showAll={true} />
          </div>
        </section>
      )}

      {/* Other Brands Section */}
      {otherVideos.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">More Brands</h2>
              <p className="text-lg text-muted-foreground">
                Additional commercial work spanning tech, beauty, fashion, and hospitality
              </p>
            </div>
            <VideoGrid videos={otherVideos} showAll={true} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title="Ready to Elevate Your Brand?"
        description="Let's create something exceptional together. Discuss your next commercial project."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryLabel="View Editorial"
        secondaryHref="/edit"
      />
    </div>
  )
}
