import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'

interface CTASectionProps {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CTASection({
  title = "Let's Create Something Exceptional",
  description = 'Available for select projects. Get in touch to discuss your next production.',
  primaryLabel = 'Start a Project',
  primaryHref = '/contact',
  secondaryLabel = 'View Portfolio',
  secondaryHref = '/film',
}: CTASectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={primaryHref}>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              <Mail className="h-5 w-5" />
              {primaryLabel}
            </Button>
          </Link>
          <Link href={secondaryHref}>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-foreground/20 hover:bg-foreground/5 gap-2"
            >
              {secondaryLabel}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
