import { HeroSection } from '@/components/marketing/HeroSection'
import { ClientLogos } from '@/components/marketing/ClientLogos'
import { VideoGrid } from '@/components/marketing/VideoGrid'
import { ServicesCards } from '@/components/marketing/ServicesCards'
import { CTASection } from '@/components/marketing/CTASection'
import { PersonSchema, OrganizationSchema, VideoObjectSchema } from '@/components/StructuredData'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import portfolioData from '@/content-migration/inventory.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adisa Duke - Cinematographer & Director of Photography',
  description: 'Award-winning cinematographer and director of photography specializing in branded content, editorial work, and documentary storytelling. Featured work with Nike, Puma, HP, and Vimeo.',
  keywords: ['cinematographer', 'director of photography', 'DP', 'brand video production', 'editorial cinematography', 'documentary cinematography', 'commercial video production'],
  openGraph: {
    title: 'Adisa Duke - Cinematographer & Director of Photography',
    description: 'Award-winning cinematographer specializing in branded content and editorial storytelling. Work featured with Nike, Puma, HP, and Vimeo.',
    url: 'https://adisaduke.vercel.app',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Adisa Duke - Cinematographer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adisa Duke - Cinematographer & Director of Photography',
    description: 'Award-winning cinematographer specializing in branded content and editorial storytelling.',
    images: ['/og/og-home.jpg'],
  },
}

export default function HomePage() {
  // Combine branded and editorial content, filter out videos without valid IDs
  const allVideos = [
    ...portfolioData.portfolio.brandedContent,
    ...portfolioData.portfolio.editorial,
  ].filter((video) => video.vimeoId || ('youtubeId' in video && video.youtubeId))

  // Featured videos for homepage (limit to 6)
  const featuredVideos = allVideos.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <PersonSchema
        name="Adisa Duke"
        jobTitle="Director of Photography & Cinematographer"
        url="https://adisaduke.vercel.app"
        sameAs={[
          "https://instagram.com/adisaduke",
        ]}
        worksFor={{
          name: "Duke Studios",
          url: "https://adisaduke.vercel.app",
        }}
      />
      <OrganizationSchema
        name="Duke Studios"
        url="https://adisaduke.vercel.app"
        description="Professional video production and cinematography services specializing in branded content, commercials, and editorial storytelling."
        founder={{
          name: "Adisa Duke",
          jobTitle: "Director of Photography",
        }}
        sameAs={[
          "https://instagram.com/adisaduke",
        ]}
      />

      {/* Video Schema for Featured Videos */}
      {featuredVideos.slice(0, 3).map((video) => {
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
            description={`${video.role || 'Cinematography'} for ${'client' in video ? video.client : ('company' in video ? video.company : 'client')}. ${video.category} video production.`}
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

      {/* Hero Section with Client Logos */}
      <HeroSection />
      <div className="px-4 sm:px-6 lg:px-8 -mt-8 mb-24">
        <ClientLogos />
      </div>

      {/* Featured Work Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Featured Work
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A selection of recent projects for leading brands and agencies
              </p>
            </div>
            <Link href="/film" className="hidden md:block">
              <Button
                variant="outline"
                className="border-foreground/20 hover:bg-foreground/5 gap-2"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <VideoGrid videos={featuredVideos} limit={6} />

          <div className="mt-8 text-center md:hidden">
            <Link href="/film">
              <Button
                variant="outline"
                className="border-foreground/20 hover:bg-foreground/5 gap-2"
              >
                View All Work
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="border-t border-border/40">
        <ServicesCards />
      </div>

      {/* Collaborators Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Trusted Collaborations
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Working with leading agencies and production houses
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {portfolioData.professionalInfo.collaborators.map((collaborator) => (
              <div
                key={collaborator}
                className="py-6 px-4 rounded-lg border border-border/40 bg-background"
              >
                <p className="text-sm font-medium text-foreground">{collaborator}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="border-t border-border/40">
        <CTASection />
      </div>
    </div>
  )
}
