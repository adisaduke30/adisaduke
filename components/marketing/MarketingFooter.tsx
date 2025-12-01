import Link from 'next/link'
import { Instagram } from 'lucide-react'

const footerNav = {
  work: [
    { name: 'Reel', href: '/reel' },
    { name: 'Branded Content', href: '/film' },
    { name: 'Editorial', href: '/edit' },
    { name: 'Shorts', href: '/shorts' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Client Portal', href: '/login' },
  ],
}

export function MarketingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              ADISA DUKE
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Director of Photography specializing in branded content and editorial work.
              Collaborating with leading agencies and brands to create compelling visual stories.
            </p>
            <div className="mt-4">
              <a
                href="https://instagram.com/adisaduke"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">@adisaduke</span>
              </a>
            </div>
          </div>

          {/* Work Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Work</h4>
            <ul className="space-y-2">
              {footerNav.work.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              {footerNav.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Copyright {currentYear} Adisa Duke, All Rights Reserved
            </p>
            <p className="text-xs text-muted-foreground">
              Platform by{' '}
              <span className="font-medium text-foreground">Zorath LLC</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
