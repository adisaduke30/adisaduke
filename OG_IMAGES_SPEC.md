# Open Graph Images Specification

**Purpose**: Social sharing preview images for all portfolio pages
**Format**: PNG or JPG
**Dimensions**: 1200 x 630 pixels (Facebook/Twitter/LinkedIn standard)
**Location**: `public/og/` directory

---

## Required Images (7 total)

### 1. Homepage - `og-home.jpg`
**Concept**: Portfolio showcase collage
**Elements**:
- Background: Warm beige (#F5F2ED)
- Hero text: "Adisa Duke - Cinematographer & Director of Photography"
- 3-4 video thumbnails in artistic layout
- Duke Studios branding
- Featured clients: Nike, Puma, HP, Vimeo logos

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│  [Nike thumbnail]    ADISA DUKE         │
│                                         │
│  [Puma thumbnail]    Cinematographer &  │
│                      Director of        │
│  [HP thumbnail]      Photography        │
│                                         │
│                      DUKE STUDIOS       │
└─────────────────────────────────────────┘
```

---

### 2. Featured Reel - `og-reel.jpg`
**Concept**: Premium reel preview
**Elements**:
- Background: Dark cinematic gradient
- Text: "Featured Reel - Award-Winning Cinematography"
- HP Sprocket 3x4 thumbnail (hero video)
- Play button overlay
- "Watch Now" CTA

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│                                         │
│    [Large HP Sprocket thumbnail]        │
│           [Play button]                 │
│                                         │
│      FEATURED REEL                      │
│      Award-Winning Cinematography       │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3. Branded Content - `og-film.jpg`
**Concept**: Commercial work showcase
**Elements**:
- Background: Professional gradient
- Text: "Branded Content - Nike | Puma | HP"
- Grid of 4 video thumbnails (Nike, Puma, HP, Other)
- "12 Projects | 4 Major Brands"

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│  BRANDED CONTENT                        │
│  Nike | Puma | HP | Vimeo              │
│                                         │
│  [Nike]  [Puma]  [HP]   [Other]        │
│                                         │
│  12 Projects | 4 Major Brands          │
│  Duke Studios                           │
└─────────────────────────────────────────┘
```

---

### 4. Editorial Work - `og-edit.jpg`
**Concept**: Documentary storytelling
**Elements**:
- Background: Cinematic dark tone
- Text: "Editorial Work - Documentary & Narrative Storytelling"
- Semilla Nueva or DIOP thumbnail
- Film strip or editorial aesthetic

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│  EDITORIAL WORK                         │
│  Documentary & Narrative Storytelling   │
│                                         │
│  [Large editorial thumbnail]            │
│  Film strip border/accent               │
│                                         │
│  Capturing Authentic Human Experiences  │
└─────────────────────────────────────────┘
```

---

### 5. Short Form - `og-shorts.jpg`
**Concept**: Social media content
**Elements**:
- Background: Vibrant gradient
- Text: "Short Form Content - Social Media & Digital Platforms"
- Nike BHM Day in Life thumbnail
- Mobile phone frame mockup

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│  SHORT FORM CONTENT                     │
│  Social Media & Digital Platforms       │
│                                         │
│    [Phone mockup with video]            │
│                                         │
│  Engaging Stories for Every Platform    │
│  Duke Studios                           │
└─────────────────────────────────────────┘
```

---

### 6. About - `og-about.jpg`
**Concept**: Professional portrait & bio
**Elements**:
- Background: Elegant minimalist
- Professional headshot of Adisa Duke (if available, or camera/film equipment)
- Text: "Adisa Duke - Cinematographer of Haitian Heritage"
- Stats: "10+ Years | 50+ Projects | 4 Major Brands"

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│                                         │
│  [Professional    ADISA DUKE            │
│   headshot or     Cinematographer of    │
│   equipment       Haitian Heritage      │
│   photo]                                │
│                   10+ Years Experience  │
│                   50+ Projects          │
│                   4 Major Brands        │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7. Contact - `og-contact.jpg`
**Concept**: Call to action
**Elements**:
- Background: Professional gradient
- Text: "Let's Create Together - Get in Touch"
- Contact icons (email, Instagram)
- CTA: "Available for Select Projects"

**Suggested Composition**:
```
┌─────────────────────────────────────────┐
│  LET'S CREATE TOGETHER                  │
│  Get in Touch                           │
│                                         │
│  📧 Email: adisaduke30@yahoo.com        │
│  📷 Instagram: @adisaduke               │
│                                         │
│  Available for Select Projects          │
│  DUKE STUDIOS                           │
└─────────────────────────────────────────┘
```

---

## Design Guidelines

### Typography
- **Headings**: Karla Bold, 72-96px
- **Body**: Karla Regular, 36-48px
- **Small Text**: Karla Regular, 24-32px

### Colors (Match Site)
- **Background**: #F5F2ED (warm beige)
- **Text**: #151515 (near black)
- **Accent**: #222222 (dark gray)
- **Optional**: Brand colors for client logos

### Branding
- **Logo**: "DUKE STUDIOS" text or custom logo
- **Placement**: Bottom right or center
- **Size**: Subtle but visible

### Image Quality
- **Resolution**: 1200 x 630 pixels exactly
- **Format**: JPG (optimized) or PNG
- **File Size**: < 300KB each
- **DPI**: 72 (web standard)

---

## Generation Methods

### Option 1: AI Generation (Recommended for Speed)
Use tools like:
- **Canva** (free templates, easy customization)
- **Figma** (design from scratch with components)
- **Midjourney/DALL-E** (AI-generated base images)
- **Photopea** (free Photoshop alternative)

### Option 2: Dynamic Generation (Code)
Use Next.js ImageResponse API:
- Generate images programmatically
- Use video thumbnails as base
- Overlay text and branding
- Requires additional development

### Option 3: Professional Designer
- Hire designer for custom branded OG images
- Higher quality, more time
- Budget: ~$50-$150 for 7 images

---

## Quick Start with Canva

### Template Search
1. Go to https://www.canva.com
2. Search: "Open Graph Image" or "Facebook Post"
3. Change dimensions: 1200 x 630 px
4. Use "Video Production" or "Cinematography" templates

### Customization Steps
1. Upload video thumbnails from Vimeo
2. Add text overlays (use Karla font)
3. Apply beige background (#F5F2ED)
4. Add Duke Studios branding
5. Export as JPG (high quality)

### Time Estimate
- Per image: 15-30 minutes
- Total for 7 images: 2-4 hours

---

## Implementation

### File Naming
```
public/og/og-home.jpg       (Homepage)
public/og/og-reel.jpg       (Featured Reel)
public/og/og-film.jpg       (Branded Content)
public/og/og-edit.jpg       (Editorial)
public/og/og-shorts.jpg     (Short Form)
public/og/og-about.jpg      (About)
public/og/og-contact.jpg    (Contact)
```

### Adding to Pages
Each page's metadata will reference these images:

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    images: ['/og/og-page.jpg'],
  },
  twitter: {
    images: ['/og/og-page.jpg'],
  },
}
```

---

## Testing

### Preview Tools
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Open Graph Check**: https://www.opengraph.xyz/

### Test Process
1. Create OG image
2. Place in `public/og/` directory
3. Deploy to Vercel
4. Use preview tools to check
5. Verify 1200x630 dimensions
6. Confirm image loads correctly

---

## Fallback Strategy

### If Images Not Ready
The site will use:
- Default Next.js OG image behavior
- Text-based social previews
- Site name and description only

### Priority Order
1. **High Priority**: Homepage, Contact (most shared)
2. **Medium Priority**: Reel, Film, Editorial (portfolio)
3. **Low Priority**: Shorts, About (less frequently shared)

---

## Video Thumbnails to Use

### Available Thumbnails
All video thumbnails can be grabbed from:
- **Vimeo**: `https://vumbnail.com/{vimeoId}.jpg`
- **YouTube**: `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`

### Suggested Videos for OG Images

**Homepage**:
- Nike Black History Month Recap (406260664)
- Puma Suede Classics Men's (683936434)
- HP Sprocket 3x4 (727757228)

**Reel**:
- HP Sprocket 3x4 (727757228) - hero image

**Film**:
- Nike Recap (406260664)
- Puma Men's (683936434)
- HP Sprocket (727757228)
- Golden Grooming (342470080)

**Editorial**:
- Semilla Nueva (234754434)
- DIOP (294658793)

**Shorts**:
- Nike Day in Life (410466618)

---

## Next Steps

1. **Create Images**: Use Canva or designer
2. **Place in public/og/**: Upload to public folder
3. **Update Metadata**: Already configured in code
4. **Test Social Sharing**: Use preview tools
5. **Optimize**: Compress images if needed

---

## Resources

**Canva OG Templates**:
- https://www.canva.com/templates/?query=open%20graph

**Free Stock Photos** (if needed):
- https://unsplash.com (cinematography, film equipment)
- https://pexels.com (video production)

**OG Image Generators** (automated):
- https://og-playground.vercel.app/
- https://www.bannerbear.com/demos/open-graph-template/

---

**Status**: Specifications complete, ready for image creation
**Priority**: Medium (enhance social sharing)
**Time to Complete**: 2-4 hours (DIY) or 1 week (designer)
