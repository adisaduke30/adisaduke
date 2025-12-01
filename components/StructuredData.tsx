/**
 * Structured Data Component
 * Provides JSON-LD schema markup for SEO
 */

import Script from 'next/script'

interface PersonSchemaProps {
  name: string
  jobTitle: string
  url: string
  image?: string
  sameAs?: string[]
  worksFor?: {
    name: string
    url: string
  }
}

export function PersonSchema({ name, jobTitle, url, image, sameAs, worksFor }: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    ...(image && { image }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(worksFor && { worksFor: {
      '@type': 'Organization',
      name: worksFor.name,
      url: worksFor.url,
    }}),
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  description?: string
  founder?: {
    name: string
    jobTitle: string
  }
  sameAs?: string[]
  address?: {
    addressLocality?: string
    addressRegion?: string
    addressCountry?: string
  }
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  founder,
  sameAs,
  address,
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(founder && { founder: {
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.jobTitle,
    }}),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(address && { address: {
      '@type': 'PostalAddress',
      ...address,
    }}),
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface VideoObjectSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate?: string
  contentUrl?: string
  embedUrl?: string
  duration?: string
  creator?: {
    name: string
    jobTitle: string
  }
}

export function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
  creator,
}: VideoObjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    ...(uploadDate && { uploadDate }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    ...(duration && { duration }),
    ...(creator && { creator: {
      '@type': 'Person',
      name: creator.name,
      jobTitle: creator.jobTitle,
    }}),
  }

  return (
    <Script
      id={`video-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbListSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbListSchema({ items }: BreadcrumbListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
