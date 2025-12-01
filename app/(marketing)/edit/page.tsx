import { VideoGrid } from '@/components/marketing/VideoGrid'
import { CTASection } from '@/components/marketing/CTASection'
import { VideoObjectSchema } from '@/components/StructuredData'
import portfolioData from '@/content-migration/inventory.json'
import { Film } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Cinematography & Documentary Storytelling | Adisa Duke',
  description: 'Editorial cinematography and documentary video production by Director of Photography Adisa Duke. Capturing authentic human experiences through narrative and documentary storytelling. Featured editorial work for Vimeo.',
  keywords: ['editorial cinematography', 'documentary cinematography', 'documentary director of photography', 'narrative cinematography', 'editorial video production', 'documentary filmmaker', 'authentic storytelling', 'Vimeo cinematographer'],
  openGraph: {
    title: 'Editorial Cinematography & Documentary Storytelling | Adisa Duke',
    description: 'Documentary and editorial cinematography capturing authentic human experiences. Narrative storytelling with cinematic beauty.',
    url: 'https://adisaduke.vercel.app/edit',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-edit.jpg',
        width: 1200,
        height: 630,
        alt: 'Adisa Duke - Editorial & Documentary Cinematography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Cinematography & Documentary Storytelling | Adisa Duke',
    description: 'Documentary and editorial cinematography capturing authentic human experiences.',
    images: ['/og/og-edit.jpg'],
  },
}

export default function EditorialPage() {
  // Filter all editorial videos (both Vimeo and YouTube)
  const editorialVideos = portfolioData.portfolio.editorial.filter((v) => v.vimeoId || v.youtubeId)

  return (
    <div className="min-h-screen">
      {/* Video Schema for Editorial Content */}
      {editorialVideos.slice(0, 6).map((video) => {
        const videoId = video.vimeoId || video.youtubeId
        if (!videoId) return null

        const embedUrl = video.vimeoId
          ? `https://player.vimeo.com/video/${video.vimeoId}`
          : `https://www.youtube.com/embed/${video.youtubeId}`

        const thumbnailUrl = video.vimeoId
          ? `https://vumbnail.com/${video.vimeoId}.jpg`
          : `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

        return (
          <VideoObjectSchema
            key={String(videoId)}
            name={video.title}
            description={`${video.role || 'Cinematography'} for ${'company' in video ? video.company : 'editorial project'}. ${video.category} documentary and editorial video production.`}
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
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Editorial</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Editorial Work
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Documentary and narrative storytelling that captures authentic human experiences
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">Documentary</h3>
              <p className="text-sm text-muted-foreground">
                Capturing real stories with authenticity and cinematic beauty
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Narrative</h3>
              <p className="text-sm text-muted-foreground">
                Crafting visual narratives that resonate with audiences
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Platform Stories</h3>
              <p className="text-sm text-muted-foreground">
                Editorial content for Vimeo and digital platforms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Editorial Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A selection of documentary and editorial work showcasing authentic storytelling and cinematic craft.
              From social impact organizations to cultural narratives, each project represents a commitment to meaningful visual storytelling.
            </p>
          </div>
          <VideoGrid videos={editorialVideos} showAll={true} />
        </div>
      </section>

      {/* Featured Project Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Editorial Highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-border/40 bg-background">
              <h3 className="text-xl font-semibold mb-3">Vimeo Stories in Place</h3>
              <p className="text-muted-foreground mb-4">
                A collaborative editorial piece for Vimeo's platform, exploring the intersection of place, culture, and visual storytelling.
              </p>
              <div className="text-sm text-muted-foreground">Role: Director of Photography</div>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background">
              <h3 className="text-xl font-semibold mb-3">DIOP</h3>
              <p className="text-muted-foreground mb-4">
                A narrative documentary exploring cultural identity and heritage through a cinematic lens.
              </p>
              <div className="text-sm text-muted-foreground">Role: Cinematographer</div>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background">
              <h3 className="text-xl font-semibold mb-3">Semilla Nueva: Who We Are</h3>
              <p className="text-muted-foreground mb-4">
                Documentary work for a social impact organization focused on agricultural innovation and community development.
              </p>
              <div className="text-sm text-muted-foreground">Role: Director of Photography</div>
            </div>
            <div className="p-6 rounded-lg border border-border/40 bg-background">
              <h3 className="text-xl font-semibold mb-3">Platform Content</h3>
              <p className="text-muted-foreground mb-4">
                Editorial pieces created for YouTube and other digital platforms, blending documentary techniques with platform-specific storytelling.
              </p>
              <div className="text-sm text-muted-foreground">Role: DP & Editor</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Tell Your Story"
        description="Whether it's a documentary, narrative piece, or editorial content, let's create something meaningful together."
        primaryLabel="Discuss Your Project"
        primaryHref="/contact"
        secondaryLabel="View Commercial Work"
        secondaryHref="/film"
      />
    </div>
  )
}
