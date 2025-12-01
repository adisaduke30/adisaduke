import { VideoGrid } from '@/components/marketing/VideoGrid'
import { CTASection } from '@/components/marketing/CTASection'
import { VideoObjectSchema } from '@/components/StructuredData'
import portfolioData from '@/content-migration/inventory.json'
import { Zap, Film, Camera } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Short Form Video Content & Social Media Production | Adisa Duke',
  description: 'Professional short form video content and social media cinematography. Instagram, TikTok, and digital platform video production. Fast-paced, engaging content optimized for social sharing.',
  keywords: ['short form video', 'social media video production', 'Instagram video', 'TikTok cinematography', 'social content creator', 'digital video production', 'vertical video production', 'social media cinematographer'],
  openGraph: {
    title: 'Short Form Video Content & Social Media Production | Adisa Duke',
    description: 'Professional short form video content for Instagram, TikTok, and digital platforms. Engaging stories optimized for social sharing.',
    url: 'https://adisaduke.vercel.app/shorts',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-shorts.jpg',
        width: 1200,
        height: 630,
        alt: 'Adisa Duke - Short Form Video & Social Media Content',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Short Form Video Content & Social Media Production | Adisa Duke',
    description: 'Professional short form video for Instagram, TikTok, and digital platforms.',
    images: ['/og/og-shorts.jpg'],
  },
}

export default function ShortsPage() {
  // Filter videos that are short-form content (social media focused, quick campaigns)
  // Nike Day in the Life, Nike BHM Recap, Puma social campaigns
  const shortsVideos = [
    portfolioData.portfolio.brandedContent.find((v) => v.title === 'Nike Black History Month Day in the Life'),
    portfolioData.portfolio.brandedContent.find((v) => v.title === 'Nike Black History Month Recap 2020'),
    ...portfolioData.portfolio.brandedContent.filter((v) =>
      v.client === 'Puma' && v.vimeoId
    ),
  ].filter((v) => v && v.vimeoId) as any[]

  return (
    <div className="min-h-screen">
      {/* Video Schema for Short Form Content */}
      {shortsVideos.slice(0, 6).map((video) => {
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
            description={`${video.role} for ${video.client}. Short form ${video.category} video content for social media platforms.`}
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
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-border/40 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Short Form</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Short Form Content
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Quick, impactful storytelling optimized for social media and digital platforms
          </p>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Social First</h3>
              <p className="text-sm text-muted-foreground">
                Content designed for Instagram, TikTok, and social platforms
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Impact</h3>
              <p className="text-sm text-muted-foreground">
                Capturing attention in seconds with compelling visuals
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Brand Stories</h3>
              <p className="text-sm text-muted-foreground">
                Authentic storytelling in bite-sized formats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Shorts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A collection of short-form content optimized for social media and digital consumption.
              Fast-paced, visually compelling, and designed to stop the scroll.
            </p>
          </div>
          <VideoGrid videos={shortsVideos} showAll={true} />
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Short Form Expertise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-border/40 bg-background text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Social Media</h3>
              <p className="text-sm text-muted-foreground">
                Instagram Reels, TikTok, Stories
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Product Videos</h3>
              <p className="text-sm text-muted-foreground">
                Quick product showcases
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Behind the Scenes</h3>
              <p className="text-sm text-muted-foreground">
                Day in the life content
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Campaign Assets</h3>
              <p className="text-sm text-muted-foreground">
                Multi-platform content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Need Short Form Content?"
        description="Create engaging short-form videos that capture attention and drive results on social platforms."
        primaryLabel="Start Your Campaign"
        primaryHref="/contact"
        secondaryLabel="View Full Portfolio"
        secondaryHref="/film"
      />
    </div>
  )
}
