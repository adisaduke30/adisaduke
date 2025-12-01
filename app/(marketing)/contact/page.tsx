import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/marketing/ContactForm'
import { Mail, Calendar, Instagram, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Adisa Duke - Hire Professional Cinematographer & DP',
  description: 'Hire Adisa Duke for your next video production project. Director of Photography available for branded content, commercials, editorial, and documentary work. Get a quote for professional cinematography services.',
  keywords: ['hire cinematographer', 'hire director of photography', 'book DP', 'cinematography quote', 'video production inquiry', 'commercial cinematographer for hire', 'freelance DP', 'video production contact'],
  openGraph: {
    title: 'Contact Adisa Duke - Hire Professional Cinematographer',
    description: 'Available for branded content, commercials, editorial, and documentary work. Get in touch to discuss your project.',
    url: 'https://adisaduke.vercel.app/contact',
    siteName: 'Duke Studios',
    images: [
      {
        url: '/og/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Adisa Duke - Cinematographer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Adisa Duke - Hire Professional Cinematographer',
    description: 'Available for branded content, commercials, editorial work. Get in touch.',
    images: ['/og/og-contact.jpg'],
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Get In Touch
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Let's discuss your next project and bring your vision to life
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Quick Contact Form */}
            <div>
              <Card className="border-border/50 bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    Quick question or comment? Send us a message and we'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Booking Option */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-accent/5 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Start a Project
                  </CardTitle>
                  <CardDescription>
                    Ready to begin? Submit a detailed project inquiry through our booking system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    For commercial projects, brand campaigns, editorial work, or any video production needs, use our detailed booking form to provide project specifics including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Project type and scope</li>
                    <li>Timeline and deadlines</li>
                    <li>Budget range</li>
                    <li>Creative vision and goals</li>
                  </ul>
                  <Link href="/login">
                    <Button size="lg" className="w-full group">
                      Submit Detailed Inquiry
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground text-center">
                    New to Duke Studios? Create a free account to access the client portal and booking system.
                  </p>
                </CardContent>
              </Card>

              {/* Direct Contact Info */}
              <Card className="border-border/50 bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Other Ways to Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a
                        href="mailto:adisaduke30@yahoo.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        adisaduke30@yahoo.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Instagram className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Instagram</div>
                      <a
                        href="https://www.instagram.com/adisaduke"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        @adisaduke
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">What types of projects do you work on?</h3>
              <p className="text-muted-foreground">
                I work on commercial brand campaigns, editorial content, documentary projects, and short-form social media content. Each project receives the same level of cinematic craft and attention to detail.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What is your typical turnaround time?</h3>
              <p className="text-muted-foreground">
                Turnaround varies by project scope and complexity. After discussing your needs, I'll provide a detailed timeline that fits your schedule and ensures quality results.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you work with production companies?</h3>
              <p className="text-muted-foreground">
                Yes! I regularly collaborate with production companies and agencies including Networkgray, Palette Group, House of Malcolm, and Matte Projects.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Where are you based?</h3>
              <p className="text-muted-foreground">
                I'm available for projects locally and willing to travel for the right project. Location logistics can be discussed during project planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Create Something Exceptional?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're a brand, agency, or individual with a story to tell, let's make it happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/film">
              <Button size="lg" variant="outline" className="group">
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
