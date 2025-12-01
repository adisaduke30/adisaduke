import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://adisaduke.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/projects/',
          '/bookings/',
          '/invoices/',
          '/messages/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
