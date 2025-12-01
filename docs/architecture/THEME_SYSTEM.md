# Duke Studios - Dual Theme System Documentation

Duke Studios implements a sophisticated dual theme system that provides distinct visual experiences for the public marketing site and the application dashboards.

## Overview

The platform uses **two complete themes**:
1. **Light Theme** - For marketing site (public portfolio)
2. **Dark Theme** - For application (client and admin portals)

This separation allows the public-facing site to have a clean, minimalist aesthetic while the dashboards maintain a professional, cinematic feel.

---

## Theme Architecture

### Light Theme (Marketing)

**Purpose**: Public marketing site showcasing Adisa Duke's portfolio

**Color Palette**:
- Background: `#F5F2ED` (warm beige)
- Primary text: `#151515` (near black)
- Secondary text: `#555555` (medium gray)
- Accent: `#222222` (dark gray)

**Typography**:
- Font family: **Karla** (Google Fonts)
- Style: Clean, modern, approachable
- Weight: Regular (400) and Bold (700)

**Visual Style**:
- Minimalist portfolio aesthetic
- High contrast for readability
- Gallery-like presentation
- Clean lines and spacing

**Applied to**:
- Homepage (`/`)
- Portfolio pages (`/reel`, `/film`, `/edit`, `/shorts`)
- About page (`/about`)
- Contact page (`/contact`)
- Services page (`/services`)

### Dark Theme (Application)

**Purpose**: Client and admin portals for project management

**Color Palette**:
- Background: `#0a0a0a` (near black)
- Foreground: `#ffffff` (white)
- Primary accent: `#FCD34D` (gold)
- Card background: `#1a1a1a` (dark gray)
- Borders: `#333333` (medium dark gray)

**Typography**:
- Font family: **Inter** (Google Fonts)
- Style: Professional, technical, readable
- Weight: Regular (400), Medium (500), Bold (700)

**Visual Style**:
- Cinematic dark aesthetic
- Gold accents for emphasis
- Professional dashboard feel
- High information density

**Applied to**:
- Client dashboard (`/dashboard`)
- Client portal pages (`/projects`, `/bookings`, `/messages`, `/invoices`)
- Admin portal (`/admin/*`)
- Authentication pages (`/login`, `/signup`, etc.)

---

## Implementation

### 1. CSS Variables (`app/globals.css`)

The theme system uses CSS custom properties (variables) defined in HSL color space for easy manipulation.

```css
@layer base {
  :root {
    /* Dark theme (default) */
    --background: 0 0% 4%; /* #0a0a0a */
    --foreground: 0 0% 100%; /* #ffffff */
    --primary: 51 100% 50%; /* #FCD34D gold */
    --card: 0 0% 10%;
    --border: 0 0% 20%;
    /* ... more variables */
  }

  .light {
    /* Light theme for marketing */
    --background: 43 29% 95%; /* #F5F2ED */
    --foreground: 0 0% 8%; /* #151515 */
    --primary: 0 0% 13%; /* #222222 */
    --secondary: 0 0% 33%; /* #555555 */
    --card: 0 0% 100%; /* white */
    --border: 0 0% 90%;
    /* ... more variables */
  }
}
```

### 2. Font Configuration (`app/layout.tsx`)

```typescript
import { Inter, JetBrains_Mono, Karla } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${karla.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
```

### 3. Tailwind Configuration (`tailwind.config.ts`)

```typescript
export default {
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        karla: ['var(--font-karla)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more color mappings
      },
    },
  },
}
```

### 4. Theme Application via Route Groups

**Root Layout** (`app/layout.tsx`):
```typescript
<html lang="en" className="dark">
  {/* Dark theme by default for app */}
</html>
```

**Marketing Layout** (`app/(marketing)/layout.tsx`):
```typescript
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light min-h-screen bg-background font-karla">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
```

**Key Points**:
- Root layout applies `dark` class to `<html>`
- Marketing layout wraps content in `<div className="light">`
- The `.light` class overrides CSS variables for that subtree
- Font is switched via `font-karla` class

---

## Theme-Specific Components

### Marketing Components (Light Theme)

Located in `components/marketing/`:
- MarketingNav
- MarketingFooter
- HeroSection
- ClientLogos
- VideoGrid
- ServicesCards
- CTASection

**Styling**:
- Use `text-foreground`, `text-muted-foreground`
- Use `bg-background`, `bg-card`
- Use `border-border`
- Font: `font-karla` applied at layout level

### Dashboard Components (Dark Theme)

Located in `components/admin/` and `components/layout/`:
- DashboardLayout
- StatsCard
- ProjectCard
- ClientCard
- NotificationCenter

**Styling**:
- Use `text-foreground`, `text-muted-foreground`
- Use `bg-background`, `bg-card`
- Use `border-border`
- Gold accents via `text-primary` or `bg-primary`
- Font: `font-sans` (Inter) is default

---

## Color Variable Reference

### All Available Variables

```css
/* Light and Dark themes both define: */
--background         /* Page background */
--foreground         /* Primary text color */
--card               /* Card background */
--card-foreground    /* Card text color */
--popover            /* Popover background */
--popover-foreground /* Popover text */
--primary            /* Primary brand color */
--primary-foreground /* Text on primary color */
--secondary          /* Secondary brand color */
--secondary-foreground /* Text on secondary */
--muted              /* Muted backgrounds */
--muted-foreground   /* Muted text */
--accent             /* Accent color */
--accent-foreground  /* Text on accent */
--destructive        /* Error/danger color */
--destructive-foreground /* Text on destructive */
--border             /* Border color */
--input              /* Input border color */
--ring               /* Focus ring color */
--radius             /* Border radius */
```

### Usage in Components

```typescript
// ✅ Correct - Uses theme variables
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>

// ❌ Wrong - Hardcoded colors (won't adapt to theme)
<div className="bg-white text-black">
  <p className="text-gray-600">Secondary text</p>
</div>
```

---

## Theme Switching Flow

### User Journey: Marketing → App

1. User visits homepage `/` → **Light theme** applied
2. User clicks "Client Portal" → Navigates to `/login`
3. Login page uses **dark theme** (root layout)
4. After login → Redirects to `/dashboard` → **Dark theme** continues

### Route-Based Theme Assignment

| Route | Theme | Class Applied | Font |
|-------|-------|---------------|------|
| `/` | Light | `.light` on wrapper div | Karla |
| `/reel` | Light | `.light` on wrapper div | Karla |
| `/film` | Light | `.light` on wrapper div | Karla |
| `/about` | Light | `.light` on wrapper div | Karla |
| `/contact` | Light | `.light` on wrapper div | Karla |
| `/login` | Dark | `.dark` on html | Inter |
| `/signup` | Dark | `.dark` on html | Inter |
| `/dashboard` | Dark | `.dark` on html | Inter |
| `/projects/*` | Dark | `.dark` on html | Inter |
| `/admin/*` | Dark | `.dark` on html | Inter |

---

## Best Practices

### DO's

✅ **Use CSS variables for colors**
```typescript
<div className="bg-background text-foreground border border-border">
```

✅ **Let the theme system handle colors**
```typescript
<Button className="bg-primary text-primary-foreground">
```

✅ **Use semantic color names**
```typescript
<p className="text-muted-foreground">Less important text</p>
```

✅ **Apply font at layout level**
```typescript
// Marketing layout
<div className="font-karla">
```

### DON'Ts

❌ **Don't hardcode colors**
```typescript
// Bad
<div className="bg-white text-black">
```

❌ **Don't mix theme-specific classes**
```typescript
// Bad - mixing light and dark assumptions
<div className="bg-[#F5F2ED] text-white">
```

❌ **Don't apply theme class to individual components**
```typescript
// Bad - theme should be at layout level
<div className="light">
  <Button>Click me</Button>
</div>
```

❌ **Don't override theme variables in components**
```css
/* Bad */
.my-component {
  --background: #ffffff; /* Breaks theme system */
}
```

---

## Adding New Colors

If you need to add a new color to the theme system:

1. **Define in both themes** (`app/globals.css`):
```css
:root {
  --success: 120 100% 40%; /* Dark theme green */
}

.light {
  --success: 120 100% 35%; /* Light theme green */
}
```

2. **Add to Tailwind config** (`tailwind.config.ts`):
```typescript
colors: {
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
  },
}
```

3. **Use in components**:
```typescript
<div className="bg-success text-success-foreground">
  Success message
</div>
```

---

## Testing Themes

### Manual Testing

1. **Light theme**: Visit `/` and check:
   - Background is #F5F2ED
   - Text is dark
   - Font is Karla
   - All marketing components render correctly

2. **Dark theme**: Visit `/dashboard` and check:
   - Background is near-black
   - Text is white
   - Gold accents visible
   - Font is Inter

### Automated Testing

```typescript
// Test theme variables are applied
it('should apply light theme to marketing pages', () => {
  render(<MarketingLayout><HomePage /></MarketingLayout>)
  const wrapper = screen.getByTestId('marketing-wrapper')
  expect(wrapper).toHaveClass('light')
})

it('should apply dark theme to dashboard', () => {
  render(<DashboardLayout><DashboardPage /></DashboardLayout>)
  const html = document.documentElement
  expect(html).toHaveClass('dark')
})
```

---

## Troubleshooting

### Theme not applying

**Problem**: Page shows wrong colors

**Solutions**:
1. Check if correct layout is wrapping the page
2. Verify `.light` or `.dark` class is present in DOM
3. Check browser DevTools for CSS variable values
4. Ensure Tailwind classes are using theme variables

### Fonts not loading

**Problem**: Wrong font displaying

**Solutions**:
1. Check font is loaded in root layout
2. Verify font variable is in body className
3. Check Tailwind config has font family mapped
4. Verify `font-karla` or `font-sans` is applied

### Colors look wrong

**Problem**: Colors don't match design

**Solutions**:
1. Verify CSS variable values in `globals.css`
2. Check HSL values are correct
3. Test in both light and dark modes
4. Verify no hardcoded colors overriding theme

---

## Future Enhancements

### User Theme Preference (Optional)

Allow users to choose light/dark mode for the dashboard:

```typescript
// Store preference in localStorage
const [theme, setTheme] = useState<'light' | 'dark'>('dark')

useEffect(() => {
  const saved = localStorage.getItem('theme')
  if (saved) setTheme(saved as 'light' | 'dark')
}, [])

return (
  <div className={theme}>
    {children}
  </div>
)
```

### High Contrast Mode

For accessibility:

```css
.high-contrast {
  --background: 0 0% 0%; /* Pure black */
  --foreground: 0 0% 100%; /* Pure white */
  --border: 0 0% 100%; /* High contrast borders */
}
```

---

## Summary

**Duke Studios Dual Theme System**:
- ✅ Light theme (#F5F2ED, Karla) for marketing site
- ✅ Dark theme (#0a0a0a, Inter, gold accents) for app
- ✅ Automatic theme switching via route groups
- ✅ CSS variables for consistent theming
- ✅ Tailwind integration
- ✅ Easy to maintain and extend

**Key Files**:
- `app/globals.css` - Theme variable definitions
- `app/layout.tsx` - Root layout with dark theme
- `app/(marketing)/layout.tsx` - Marketing layout with light theme
- `tailwind.config.ts` - Tailwind theme configuration

---

**Last Updated**: December 1, 2025
**Version**: 1.0
**Zorath LLC** | Duke Studios
