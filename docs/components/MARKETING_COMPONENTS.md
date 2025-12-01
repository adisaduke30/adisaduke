# Duke Studios - Marketing Components Documentation

Complete reference for all marketing site components used in the Duke Studios public portfolio.

**Location**: `components/marketing/`
**Theme**: Light minimalist
**Font**: Karla
**Total Components**: 12
**Last Updated**: December 1, 2025 (Week 2 - YouTube Support Added)

---

## Component Index

### Week 1 Components (7)
1. [MarketingNav](#1-marketingnav) - Responsive navigation bar
2. [MarketingFooter](#2-marketingfooter) - Footer with links and social
3. [HeroSection](#3-herosection) - Homepage hero with CTAs
4. [ClientLogos](#4-clientlogos) - Major client showcase
5. [VideoGrid](#5-videogrid) - Portfolio video display with modal playback
6. [ServicesCards](#6-servicescards) - Services showcase
7. [CTASection](#7-ctasection) - Call-to-action sections

### Week 2 Components (5)
8. [VimeoPlayer](#8-vimeoplayer) - Responsive Vimeo video embedding
9. [VideoModal](#9-videomodal) - Full-screen video player dialog
10. [ContactForm](#10-contactform) - Contact form with validation
11. [YouTubePlayer](#11-youtubeplayer) - Responsive YouTube video embedding (added Dec 1)
12. [VideoPlayer](#12-videoplayer) - Platform-agnostic video player wrapper (added Dec 1)

---

## 1. MarketingNav

**File**: `components/marketing/MarketingNav.tsx`

### Purpose

Responsive navigation bar for the marketing site with mobile menu support.

### Features

- Desktop horizontal navigation
- Mobile hamburger menu
- Sticky header with backdrop blur
- Active route highlighting
- Client Portal CTA button
- Smooth animations

### Props

**No props** - Navigation is static and defined within the component.

### Usage

```typescript
import { MarketingNav } from '@/components/marketing/MarketingNav'

export default function MarketingLayout({ children }) {
  return (
    <div>
      <MarketingNav />
      <main>{children}</main>
    </div>
  )
}
```

### Navigation Links

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Reel', href: '/reel' },
  { name: 'Branded', href: '/film' },
  { name: 'Editorial', href: '/edit' },
  { name: 'Shorts', href: '/shorts' },
  { name: 'Contact', href: '/contact' },
]
```

### Styling

**Desktop**:
- Horizontal layout with gap-8
- Links with hover effects
- Sticky positioning (`sticky top-0`)
- Backdrop blur effect

**Mobile**:
- Hamburger icon (Menu/X from Lucide)
- Dropdown menu below header
- Full-width buttons
- Touch-optimized spacing

### State Management

```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
```

### Active Route Detection

```typescript
const pathname = usePathname()

<Link
  className={pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}
>
  {item.name}
</Link>
```

### Customization

To add new navigation links:

```typescript
// Add to navigation array
const navigation = [
  // ... existing links
  { name: 'About', href: '/about' },
]
```

---

## 2. MarketingFooter

**File**: `components/marketing/MarketingFooter.tsx`

### Purpose

Footer section with navigation links, social media, and copyright information.

### Features

- 4-column grid layout
- Brand description section
- Work links (portfolio pages)
- Company links
- Instagram social link
- Copyright notice
- Zorath LLC branding

### Props

**No props** - Footer content is static.

### Usage

```typescript
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function MarketingLayout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
```

### Footer Structure

```typescript
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
```

### Layout

**Desktop**:
- 4-column grid
- Col 1-2: Brand + description
- Col 3: Work links
- Col 4: Company links

**Mobile**:
- Single column
- Stacked sections

### Social Links

```typescript
<a
  href="https://instagram.com/adisaduke"
  target="_blank"
  rel="noopener noreferrer"
>
  <Instagram className="h-5 w-5" />
  @adisaduke
</a>
```

### Copyright

```typescript
const currentYear = new Date().getFullYear()

<p>Copyright {currentYear} Adisa Duke, All Rights Reserved</p>
<p>Platform by Zorath LLC</p>
```

---

## 3. HeroSection

**File**: `components/marketing/HeroSection.tsx`

### Purpose

Large hero section for the homepage with headline, subtitle, description, and CTAs.

### Features

- Large responsive headline
- Subtitle (Director of Photography)
- Compelling description
- Two CTA buttons (primary + secondary)
- Scroll indicator animation
- Centered layout

### Props

**No props** - Content is hardcoded.

### Usage

```typescript
import { HeroSection } from '@/components/marketing/HeroSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      {/* Other sections */}
    </div>
  )
}
```

### Content Structure

```typescript
<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
  ADISA DUKE
</h1>
<p className="text-xl sm:text-2xl md:text-3xl">
  Director of Photography
</p>
<p className="text-base sm:text-lg">
  Crafting compelling visual narratives...
</p>
```

### CTA Buttons

```typescript
<Link href="/reel">
  <Button size="lg">
    <Play className="h-5 w-5" />
    Watch Reel
  </Button>
</Link>
<Link href="/contact">
  <Button size="lg" variant="outline">
    <Mail className="h-5 w-5" />
    Get in Touch
  </Button>
</Link>
```

### Scroll Indicator

```typescript
<div className="animate-bounce">
  <div className="w-6 h-10 border-2 border-foreground/20 rounded-full">
    <div className="w-1 h-2 bg-foreground/40 rounded-full" />
  </div>
</div>
```

### Responsive Scaling

| Breakpoint | Heading Size |
|------------|--------------|
| Mobile | text-5xl (48px) |
| SM (640px) | text-6xl (60px) |
| MD (768px) | text-7xl (72px) |
| LG (1024px) | text-8xl (96px) |

---

## 4. ClientLogos

**File**: `components/marketing/ClientLogos.tsx`

### Purpose

Display major client logos in a grid layout.

### Features

- 4 major clients displayed
- Hover effects
- Grid layout (2 cols mobile, 4 cols desktop)
- Text-based logos (placeholder for images)

### Props

**No props** - Clients are hardcoded.

### Usage

```typescript
import { ClientLogos } from '@/components/marketing/ClientLogos'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ClientLogos />
    </div>
  )
}
```

### Clients Data

```typescript
const clients = [
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Puma', logo: 'PUMA' },
  { name: 'HP', logo: 'HP' },
  { name: 'Vimeo', logo: 'VIMEO' },
]
```

### Layout

```typescript
<div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
  {clients.map((client) => (
    <div className="text-foreground/40 hover:text-foreground/60">
      <span className="text-2xl font-bold">{client.logo}</span>
    </div>
  ))}
</div>
```

### Future Enhancement

Replace text with actual logo images:

```typescript
<Image
  src={`/logos/${client.name.toLowerCase()}.svg`}
  alt={client.name}
  width={120}
  height={60}
/>
```

---

## 5. VideoGrid

**File**: `components/marketing/VideoGrid.tsx`

### Purpose

Grid display of portfolio videos with Vimeo thumbnails and hover overlays.

### Features

- Vimeo thumbnail integration
- Hover overlay with video details
- Play button icon
- Video title, client, and role display
- Responsive grid
- Configurable video limit
- Bottom info bar

### Props

```typescript
interface VideoGridProps {
  videos: Video[]    // Array of video objects
  showAll?: boolean  // Show all or limit (default: false)
  limit?: number     // Number of videos to show (default: 6)
}

interface Video {
  title: string
  vimeoId?: string | null
  youtubeId?: string
  role?: string
  client?: string
  category: string
  url?: string | null
  company?: string
  director?: string
  note?: string
  relatedLink?: string
}
```

### Usage

**Basic**:
```typescript
import { VideoGrid } from '@/components/marketing/VideoGrid'
import portfolioData from '@/content-migration/inventory.json'

const videos = portfolioData.portfolio.brandedContent

<VideoGrid videos={videos} />
```

**With Limit**:
```typescript
<VideoGrid videos={videos} limit={3} />
```

**Show All**:
```typescript
<VideoGrid videos={videos} showAll={true} />
```

### Video Card Structure

```typescript
<div className="aspect-video">
  {/* Vimeo Thumbnail */}
  <img
    src={`https://vumbnail.com/${video.vimeoId}.jpg`}
    alt={video.title}
  />

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-foreground/80 opacity-0 hover:opacity-100">
    <Play className="h-12 w-12" fill="currentColor" />
    <h3>{video.title}</h3>
    {video.client && <p>{video.client}</p>}
    {video.role && <p>{video.role}</p>}
  </div>

  {/* Bottom Info Bar */}
  <div className="absolute bottom-0">
    <h3>{video.title}</h3>
  </div>
</div>
```

### Grid Layout

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

| Breakpoint | Columns |
|------------|---------|
| Mobile (< 768px) | 1 column |
| Tablet (768px+) | 2 columns |
| Desktop (1024px+) | 3 columns |

### Hover Effects

- Overlay fades in on hover
- Image scales slightly (scale-105)
- Play button appears
- Video details shown

### Data Filtering

```typescript
const displayVideos = showAll ? videos : videos.slice(0, limit)

// Filter out videos without vimeoId
if (!video.vimeoId) return null
```

---

## 6. ServicesCards

**File**: `components/marketing/ServicesCards.tsx`

### Purpose

Showcase services offered with icons and descriptions.

### Features

- 4 service cards
- Icon for each service
- Title and description
- Hover effects
- Grid layout

### Props

**No props** - Services are hardcoded.

### Usage

```typescript
import { ServicesCards } from '@/components/marketing/ServicesCards'

export default function HomePage() {
  return (
    <div>
      <ServicesCards />
    </div>
  )
}
```

### Services Data

```typescript
const services = [
  {
    icon: Camera,
    title: 'Cinematography',
    description: 'Expert Director of Photography services...',
  },
  {
    icon: Palette,
    title: 'Color Grading',
    description: 'Professional color grading...',
  },
  {
    icon: Film,
    title: 'Editing',
    description: 'Comprehensive video editing services...',
  },
  {
    icon: Video,
    title: 'Camera Operation',
    description: 'Technical expertise in camera operation...',
  },
]
```

### Card Structure

```typescript
<div className="group p-8 rounded-lg border hover:border-foreground/20">
  <service.icon className="h-10 w-10" />
  <h3 className="text-xl font-semibold">{service.title}</h3>
  <p className="text-sm text-muted-foreground">{service.description}</p>
</div>
```

### Layout

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
```

| Breakpoint | Columns |
|------------|---------|
| Mobile | 1 column |
| Tablet (768px+) | 2 columns |
| Desktop (1024px+) | 4 columns |

### Icons

From **Lucide React**:
- Camera (Cinematography)
- Palette (Color Grading)
- Film (Editing)
- Video (Camera Operation)

---

## 7. CTASection

**File**: `components/marketing/CTASection.tsx`

### Purpose

Reusable call-to-action section with customizable content and buttons.

### Features

- Customizable heading and description
- Two CTA buttons (primary and secondary)
- Centered layout
- Flexible props for reuse
- Icons support

### Props

```typescript
interface CTASectionProps {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}
```

### Default Props

```typescript
{
  title: "Let's Create Something Exceptional",
  description: 'Available for select projects. Get in touch to discuss your next production.',
  primaryLabel: 'Start a Project',
  primaryHref: '/contact',
  secondaryLabel: 'View Portfolio',
  secondaryHref: '/film',
}
```

### Usage

**Default**:
```typescript
import { CTASection } from '@/components/marketing/CTASection'

<CTASection />
```

**Custom**:
```typescript
<CTASection
  title="Ready to Work Together?"
  description="Let's discuss your next video project"
  primaryLabel="Contact Me"
  primaryHref="/contact"
  secondaryLabel="View My Work"
  secondaryHref="/portfolio"
/>
```

### Button Structure

```typescript
<Link href={primaryHref}>
  <Button size="lg" className="bg-foreground text-background">
    <Mail className="h-5 w-5" />
    {primaryLabel}
  </Button>
</Link>
<Link href={secondaryHref}>
  <Button size="lg" variant="outline">
    {secondaryLabel}
    <ArrowRight className="h-5 w-5" />
  </Button>
</Link>
```

### Layout

- Centered text
- Max width 4xl (896px)
- Responsive button layout (stack on mobile)

---

## Shared Patterns

### 1. Responsive Design

All components use Tailwind responsive modifiers:

```typescript
className="text-base sm:text-lg md:text-xl lg:text-2xl"
```

### 2. Theme Variables

All components use theme CSS variables:

```typescript
className="bg-background text-foreground border-border"
```

### 3. Lucide Icons

All icons from Lucide React:

```typescript
import { Play, Mail, Camera, Instagram } from 'lucide-react'
```

### 4. Next.js Link

All navigation uses Next.js Link:

```typescript
import Link from 'next/link'

<Link href="/reel">Watch Reel</Link>
```

### 5. Shadcn/UI Components

Button component from Shadcn/UI:

```typescript
import { Button } from '@/components/ui/button'

<Button variant="outline" size="lg">Click Me</Button>
```

---

## Styling Guidelines

### Color Usage

```typescript
// ✅ Correct - Uses theme variables
<div className="bg-background text-foreground">
<p className="text-muted-foreground">

// ❌ Wrong - Hardcoded colors
<div className="bg-white text-black">
```

### Spacing

```typescript
// Section spacing
<section className="py-24 px-4 sm:px-6 lg:px-8">

// Container
<div className="max-w-7xl mx-auto">

// Element spacing
<div className="space-y-6">
<div className="gap-4 md:gap-6 lg:gap-8">
```

### Typography

```typescript
// Headings
<h2 className="text-4xl sm:text-5xl font-bold">

// Body text
<p className="text-base sm:text-lg text-muted-foreground">

// Small text
<span className="text-sm text-muted-foreground">
```

---

## Component Composition

### Example: Homepage

```typescript
import { HeroSection } from '@/components/marketing/HeroSection'
import { ClientLogos } from '@/components/marketing/ClientLogos'
import { VideoGrid } from '@/components/marketing/VideoGrid'
import { ServicesCards } from '@/components/marketing/ServicesCards'
import { CTASection } from '@/components/marketing/CTASection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ClientLogos />

      <section className="py-24">
        <VideoGrid videos={featuredVideos} limit={6} />
      </section>

      <ServicesCards />

      <CTASection />
    </div>
  )
}
```

---

## Testing

### Component Testing Checklist

- [ ] Renders without errors
- [ ] Props work as expected
- [ ] Responsive on mobile, tablet, desktop
- [ ] Hover effects work
- [ ] Links navigate correctly
- [ ] Icons display correctly
- [ ] Theme variables apply correctly
- [ ] Accessible (keyboard navigation, ARIA)

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/marketing/HeroSection'

test('renders hero heading', () => {
  render(<HeroSection />)
  expect(screen.getByText('ADISA DUKE')).toBeInTheDocument()
})

test('renders CTA buttons', () => {
  render(<HeroSection />)
  expect(screen.getByText('Watch Reel')).toBeInTheDocument()
  expect(screen.getByText('Get in Touch')).toBeInTheDocument()
})
```

---

## Performance

### Optimization Tips

1. **Lazy load images**:
```typescript
<img loading="lazy" src={...} />
```

2. **Use Next.js Image**:
```typescript
import Image from 'next/image'
<Image src={...} width={...} height={...} />
```

3. **Memoize video grid**:
```typescript
const VideoGrid = React.memo(({ videos, limit }) => { ... })
```

4. **Debounce search/filter**:
```typescript
const debouncedSearch = useMemo(() => debounce(search, 300), [])
```

---

## Accessibility

### ARIA Labels

```typescript
<button aria-label="Toggle menu">
  <Menu />
</button>
```

### Keyboard Navigation

```typescript
<Link href="/reel" tabIndex={0}>
  Watch Reel
</Link>
```

### Focus Indicators

```typescript
<button className="focus:outline-none focus:ring-2 focus:ring-primary">
```

---

---

## 8. VimeoPlayer

**File**: `components/marketing/VimeoPlayer.tsx`

### Purpose

Responsive Vimeo video embedding using the official @vimeo/player SDK.

### Features

- Responsive 16:9 aspect ratio
- Autoplay support
- Clean player controls
- Proper initialization and cleanup
- Black background while loading

### Props

```typescript
interface VimeoPlayerProps {
  vimeoId: string       // Vimeo video ID (e.g., "727757228")
  autoplay?: boolean    // Auto-start playback (default: false)
  className?: string    // Additional CSS classes
}
```

### Usage

```typescript
import { VimeoPlayer } from '@/components/marketing/VimeoPlayer'

<VimeoPlayer vimeoId="727757228" autoplay={true} />
```

### Implementation Details

```typescript
'use client'

import { useEffect, useRef } from 'react'
import Player from '@vimeo/player'

export function VimeoPlayer({ vimeoId, autoplay = false, className = '' }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    playerRef.current = new Player(containerRef.current, {
      id: parseInt(vimeoId),
      width: 640,
      responsive: true,
      autoplay: autoplay,
      byline: false,
      portrait: false,
      title: false,
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [vimeoId, autoplay])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    />
  )
}
```

### Configuration

- **id**: Parses vimeoId to integer
- **width**: 640px base width
- **responsive**: true (scales to container)
- **autoplay**: Controlled by prop
- **byline**: false (hides author info)
- **portrait**: false (hides author photo)
- **title**: false (hides video title)

### Cleanup

- Player destroyed on component unmount
- Prevents memory leaks
- useEffect cleanup function

---

## 9. VideoModal

**File**: `components/marketing/VideoModal.tsx`

### Purpose

Full-screen video player in a dialog overlay using Shadcn/UI Dialog component.

### Features

- Full-screen modal display
- VimeoPlayer embedded with autoplay
- Close button (X icon)
- Video title and metadata
- Black background
- Click-outside to close
- Escape key to close
- Accessible (ARIA)

### Props

```typescript
interface VideoModalProps {
  video: Video | null          // Video object with metadata
  open: boolean                // Modal open state
  onOpenChange: (open: boolean) => void  // State setter function
}

interface Video {
  title: string
  vimeoId?: string | null
  client?: string
  role?: string
  category: string
}
```

### Usage

```typescript
import { VideoModal } from '@/components/marketing/VideoModal'

const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)

const handleVideoClick = (video: Video) => {
  setSelectedVideo(video)
  setIsModalOpen(true)
}

<VideoModal
  video={selectedVideo}
  open={isModalOpen}
  onOpenChange={setIsModalOpen}
/>
```

### Layout Structure

```
┌──────────────────────────────────────────┐
│ [X]                                      │ ← Close button (top right)
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │     VimeoPlayer (16:9 ratio)       │ │ ← Video player
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Video Title (h2, 2xl, bold, white)     │ ← Metadata section
│  Client: Nike | Role: DP (sm, gray)     │
└──────────────────────────────────────────┘
```

### Key Features

**Close Methods**:
- X button click
- Click backdrop (outside dialog)
- Escape key press
- All handled by Dialog component

**Autoplay**:
- Video auto-starts when modal opens
- Controlled by VimeoPlayer autoplay prop

**Metadata Display**:
- Video title (h2, text-2xl, font-bold)
- Client and role (text-sm, text-gray-400)
- Conditional rendering (only if data exists)

---

## 10. ContactForm

**File**: `components/marketing/ContactForm.tsx`

### Purpose

Client-side contact form with validation, submission handling, and toast notifications.

### Features

- React Hook Form integration
- Zod schema validation
- Real-time field validation
- Loading state during submission
- Toast notifications (success/error)
- Form reset on success
- Accessible form fields with proper labels

### Props

**No props** - Self-contained form component

### Usage

```typescript
import { ContactForm } from '@/components/marketing/ContactForm'

<ContactForm />
```

### Form Fields

```typescript
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
```

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Name | Text input | Min 2 chars | Yes |
| Email | Email input | Valid email format | Yes |
| Message | Textarea | Min 10 chars | Yes |

### Submit Behavior

1. **Validation**: Form validates all fields
2. **Loading**: Shows spinner, disables button
3. **Server Action**: Calls `sendContactEmail(data)`
4. **Success**:
   - Toast: "Message sent! Thank you for reaching out."
   - Form resets
   - Loading state clears
5. **Error**:
   - Toast: Error message (destructive variant)
   - Form remains filled
   - Loading state clears

### Integration

**Server Action**:
```typescript
import { sendContactEmail } from '@/app/actions/contact'

const result = await sendContactEmail(data)
```

**Toast Hook**:
```typescript
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

toast({
  title: 'Message sent!',
  description: 'Thank you for reaching out. We\'ll get back to you soon.',
})
```

### Form Structure

```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField name="name">
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input placeholder="Your name" />
      </FormControl>
      <FormMessage />
    </FormField>

    <FormField name="email">
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="your@email.com" />
      </FormControl>
      <FormMessage />
    </FormField>

    <FormField name="message">
      <FormLabel>Message</FormLabel>
      <FormControl>
        <Textarea placeholder="Tell us about your project..." />
      </FormControl>
      <FormMessage />
    </FormField>

    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Sending...' : 'Send Message'}
    </Button>
  </form>
</Form>
```

### Error Handling

**Validation Errors**:
- Display under each field
- Red text color
- Prevent submission until resolved

**Submission Errors**:
- Caught in try/catch
- Displayed as destructive toast
- User can retry

### Accessibility

- Proper form labels
- Field descriptions
- Error messages announced to screen readers
- Keyboard navigation support
- Focus management

---

## 11. YouTubePlayer

**File**: `components/marketing/YouTubePlayer.tsx`
**Added**: December 1, 2025

### Purpose

Responsive YouTube video embedding using iframe embed for platform parity with Vimeo support.

### Features

- iframe-based YouTube embed
- Responsive 16:9 aspect ratio
- Autoplay support
- Clean embedding (no related videos, modest branding)
- Black background while loading
- Full-screen support

### Props

```typescript
interface YouTubePlayerProps {
  youtubeId: string     // YouTube video ID (e.g., "kH2cMs28pBY")
  autoplay?: boolean    // Auto-start playback (default: false)
  className?: string    // Additional CSS classes
}
```

### Usage

```typescript
import { YouTubePlayer } from '@/components/marketing/YouTubePlayer'

<YouTubePlayer youtubeId="kH2cMs28pBY" autoplay={true} />
```

### Implementation Details

```typescript
'use client'

export function YouTubePlayer({ youtubeId, autoplay = false, className = '' }: YouTubePlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
```

### Embed Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| autoplay | 1 or omitted | Auto-start playback |
| rel | 0 | Hide related videos at end |
| modestbranding | 1 | Minimize YouTube branding |

### Browser Compatibility

- Supported by all modern browsers
- Same compatibility as Vimeo player
- No additional dependencies required
- Standard iframe embed approach

### Why iframe over YouTube API?

- **Simpler**: No SDK dependency
- **Standard**: YouTube's recommended basic embed method
- **Sufficient**: Meets current playback needs
- **Lightweight**: No additional JavaScript payload
- **Future-proof**: Can upgrade to IFrame API later if needed

### Styling

- **Aspect Ratio**: Enforced 16:9 via CSS `aspectRatio` property
- **Background**: Black (`bg-black`) for consistency with VimeoPlayer
- **Border Radius**: Rounded corners (`rounded-lg`)
- **Layout**: Absolute positioning for iframe to fill container

---

## 12. VideoPlayer

**File**: `components/marketing/VideoPlayer.tsx`
**Added**: December 1, 2025

### Purpose

Platform-agnostic video player wrapper that auto-detects video type and renders the appropriate player component.

### Features

- Auto-detects platform (Vimeo or YouTube)
- Routes to correct player component
- Unified interface for all consumers
- Graceful fallback for unavailable videos
- Easy to extend for future platforms

### Props

```typescript
interface VideoPlayerProps {
  video: Video          // Video object with platform IDs
  autoplay?: boolean    // Auto-start playback (default: false)
  className?: string    // Additional CSS classes
}

interface Video {
  title: string
  vimeoId?: string | null
  youtubeId?: string
  role?: string
  client?: string
  category: string
}
```

### Usage

```typescript
import { VideoPlayer } from '@/components/marketing/VideoPlayer'

<VideoPlayer video={videoObject} autoplay={true} />
```

### Implementation Logic

```typescript
'use client'

import { VimeoPlayer } from './VimeoPlayer'
import { YouTubePlayer } from './YouTubePlayer'

export function VideoPlayer({ video, autoplay = false, className = '' }: VideoPlayerProps) {
  // Priority 1: Vimeo
  if (video.vimeoId) {
    return <VimeoPlayer vimeoId={video.vimeoId} autoplay={autoplay} className={className} />
  }

  // Priority 2: YouTube
  if (video.youtubeId) {
    return <YouTubePlayer youtubeId={video.youtubeId} autoplay={autoplay} className={className} />
  }

  // Fallback: No valid video ID
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <p className="text-muted-foreground text-sm">Video not available</p>
    </div>
  )
}
```

### Platform Detection

The component checks video properties in priority order:

1. **Vimeo**: If `video.vimeoId` exists → render VimeoPlayer
2. **YouTube**: If `video.youtubeId` exists → render YouTubePlayer
3. **Fallback**: If neither exists → render unavailable state

### Benefits

**For Developers**:
- Single component for all video playback
- No need to check platform manually
- Consistent props API
- Type-safe implementation

**For Future**:
- Easy to add new platforms (Wistia, custom URLs, etc.)
- Centralized platform logic
- No consumer code changes needed

### Example Platform Addition

```typescript
// Future: Add Wistia support
if (video.vimeoId) {
  return <VimeoPlayer ... />
}
if (video.youtubeId) {
  return <YouTubePlayer ... />
}
if (video.wistiaId) {  // New platform
  return <WistiaPlayer wistiaId={video.wistiaId} autoplay={autoplay} />
}
```

### Used By

- **VideoModal**: Full-screen video playback
- **Future components**: Any component needing video playback

### Fallback UI

When video has no valid ID:
- Muted gray background
- Centered text: "Video not available"
- Same 16:9 aspect ratio
- Matches design system

---

## Future Enhancements

### Component Library

- [ ] Add Storybook for component showcase
- [ ] Create component variants (sizes, colors)
- [ ] Add animation variants (Framer Motion)
- [ ] Create compound components

### New Components Needed

- [ ] TestimonialCard (for testimonials)
- [ ] LoadingSpinner (standalone)
- [ ] ErrorState (error boundaries)
- [ ] SuccessState (confirmation pages)

---

## Summary

**12 Marketing Components Built**:

### Week 1 (7 components)
1. ✅ MarketingNav - Responsive navigation
2. ✅ MarketingFooter - Footer with links
3. ✅ HeroSection - Homepage hero
4. ✅ ClientLogos - Client showcase
5. ✅ VideoGrid - Portfolio display (updated in Week 2)
6. ✅ ServicesCards - Services showcase
7. ✅ CTASection - Call-to-action

### Week 2 (5 components)
8. ✅ VimeoPlayer - Responsive video embedding
9. ✅ VideoModal - Full-screen video player
10. ✅ ContactForm - Contact form with validation
11. ✅ YouTubePlayer - YouTube video embedding (added Dec 1)
12. ✅ VideoPlayer - Platform-agnostic wrapper (added Dec 1)

**Shared Patterns**:
- Responsive design (mobile-first)
- Theme variables (light theme)
- Lucide icons
- Shadcn/UI components
- Next.js Link navigation
- TypeScript interfaces
- Accessibility (ARIA, keyboard nav)

**Dependencies**:
- @vimeo/player (video playback)
- react-hook-form (form management)
- zod (validation)
- @radix-ui/react-dialog (modal base)

**Status**: ✅ Production ready
**Next**: Week 3 - Add animations and visual assets

---

**Last Updated**: December 1, 2025
**Version**: 2.0 (Week 2)
**Zorath LLC** | Duke Studios
