import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ClientLogos } from '@/components/marketing/ClientLogos'
import { ServicesCards } from '@/components/marketing/ServicesCards'
import { CTASection } from '@/components/marketing/CTASection'
import portfolioData from '@/content-migration/inventory.json'
import { Camera, Award, Users, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Adisa Duke - Award-Winning Director of Photography',
  description: 'Adisa Duke is a Director of Photography of Haitian heritage specializing in brand video production and editorial cinematography. 10+ years experience with Nike, Puma, HP, Vimeo. Based in [City], working with Networkgray, Palette Group, and House of Malcolm.',
  keywords: ['Adisa Duke', 'cinematographer', 'director of photography', 'Haitian cinematographer', 'DP biography', 'professional cinematographer', 'video production services', 'cinematography portfolio'],
  openGraph: {
    title: 'About Adisa Duke - Award-Winning Director of Photography',
    description: 'Director of Photography of Haitian heritage. 10+ years experience, 50+ projects with Nike, Puma, HP, Vimeo.',
    url: 'https://adisaduke.vercel.app/about',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Adisa Duke - Cinematographer',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Adisa Duke - Award-Winning Director of Photography',
    description: 'DP of Haitian heritage. 10+ years, 50+ projects with major brands.',
    images: ['/og/og-about.jpg'],
  },
}

export default function AboutPage() {
  const collaborators = portfolioData.professionalInfo.collaborators

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Adisa Duke
            </h1>
            <p className="text-2xl sm:text-3xl text-muted-foreground mb-8">
              Director of Photography
            </p>
            <div className="h-1 w-24 bg-primary mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Cinematic storyteller with a passion for visual excellence
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">About</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Adisa Duke is a Director of Photography specializing in commercial and editorial cinematography. With a keen eye for visual storytelling and technical excellence, Adisa brings creative visions to life through the lens.
                </p>
                <p>
                  Working with major brands like Nike, Puma, HP, and Vimeo, Adisa has established a reputation for delivering stunning visuals that capture authentic moments and compelling narratives. From high-energy commercial campaigns to intimate documentary work, every project reflects a commitment to cinematic craft.
                </p>
                <p>
                  Beyond the camera, Adisa's expertise extends to color grading and editing, providing comprehensive visual solutions from pre-production through post. This holistic approach ensures creative vision is maintained throughout the entire production process.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border/40 bg-background">
                <Camera className="h-8 w-8 mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">12+</div>
                <div className="text-sm text-muted-foreground">Branded Projects</div>
              </div>
              <div className="p-6 rounded-lg border border-border/40 bg-background">
                <Award className="h-8 w-8 mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">4+</div>
                <div className="text-sm text-muted-foreground">Major Brands</div>
              </div>
              <div className="p-6 rounded-lg border border-border/40 bg-background">
                <Users className="h-8 w-8 mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">4+</div>
                <div className="text-sm text-muted-foreground">Agency Partners</div>
              </div>
              <div className="p-6 rounded-lg border border-border/40 bg-background">
                <Sparkles className="h-8 w-8 mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Dedication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Leading Brands</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Collaborating with world-class brands to create visual content that resonates with audiences
          </p>
          <ClientLogos />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cinematography and post-production services for commercial and editorial projects
            </p>
          </div>
          <ServicesCards />
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Collaborators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Working with exceptional production companies and agencies
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {collaborators.map((collab) => (
              <div
                key={collab}
                className="p-8 rounded-lg border border-border/40 hover:border-border transition-all hover:shadow-lg bg-background text-center"
              >
                <h3 className="text-lg font-semibold">{collab}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Approach</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every project begins with understanding the story that needs to be told. Through careful pre-production planning, technical excellence on set, and meticulous attention to detail in post, the goal is always the same: create visuals that move audiences and exceed expectations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Let's Work Together"
        description="Ready to create something exceptional? Get in touch to discuss your next project."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryLabel="View Portfolio"
        secondaryHref="/film"
      />
    </div>
  )
}
