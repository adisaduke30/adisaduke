import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Mail } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight mb-6">
          ADISA DUKE
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light mb-4">
          Director of Photography
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Crafting compelling visual narratives for leading brands and agencies.
          Specializing in branded content, editorial work, and commercial production.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/reel">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              <Play className="h-5 w-5" />
              Watch Reel
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-foreground/20 hover:bg-foreground/5 gap-2"
            >
              <Mail className="h-5 w-5" />
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Featured Clients Label */}
        <div className="border-t border-border/40 pt-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
            Featured Clients
          </p>
          {/* Client logos will be added here via ClientLogos component */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/40 rounded-full" />
        </div>
      </div>
    </section>
  )
}
