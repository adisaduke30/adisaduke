# Week 4 - Testing Guide & Checklist

**Date**: December 1, 2025
**Status**: Ready for Testing
**Build Status**: ✅ Passing (0 errors, 29 routes)

---

## Phase 1: SEO & Schema Testing (Day 1-2)

### Step 1: Test Sitemap.xml

**URL to Test**: https://adisaduke.vercel.app/sitemap.xml

**What to Check**:
- [ ] Sitemap loads without errors
- [ ] Shows all 7 marketing pages
- [ ] All URLs are absolute (https://adisaduke.vercel.app)
- [ ] Priority values present (1.0 for homepage, 0.8-0.9 for others)
- [ ] Change frequency specified
- [ ] Last modified dates present

**Expected Result**: XML file with 7 URLs

---

### Step 2: Test Robots.txt

**URL to Test**: https://adisaduke.vercel.app/robots.txt

**What to Check**:
- [ ] File loads correctly
- [ ] User-agent: * present
- [ ] Allow: / present
- [ ] Disallow paths correct (/api/, /admin/, /dashboard/, /projects/, /bookings/, /invoices/, /messages/)
- [ ] Sitemap URL points to https://adisaduke.vercel.app/sitemap.xml

**Expected Result**: Text file with proper directives

---

### Step 3: Google Rich Results Test

**Tool**: https://search.google.com/test/rich-results

Test each of these pages:

#### Homepage
**URL**: https://adisaduke.vercel.app

**Expected Schemas**:
1. Person (Adisa Duke)
2. Organization (Duke Studios)
3. VideoObject (3 featured videos)

**Steps**:
1. Go to https://search.google.com/test/rich-results
2. Enter: https://adisaduke.vercel.app
3. Click "Test URL"
4. Wait for results
5. Check for "Valid" status
6. Verify 5 total schemas detected (1 Person + 1 Org + 3 Videos)

---

#### Reel Page
**URL**: https://adisaduke.vercel.app/reel

**Expected Schemas**:
- VideoObject (5 videos)

**Steps**:
1. Go to https://search.google.com/test/rich-results
2. Enter: https://adisaduke.vercel.app/reel
3. Check for 5 VideoObject schemas
4. Verify all have name, description, thumbnailUrl, embedUrl, creator

---

#### Film Page
**URL**: https://adisaduke.vercel.app/film

**Expected Schemas**:
- VideoObject (6 videos)

---

#### Edit Page
**URL**: https://adisaduke.vercel.app/edit

**Expected Schemas**:
- VideoObject (6 videos)

---

#### Shorts Page
**URL**: https://adisaduke.vercel.app/shorts

**Expected Schemas**:
- VideoObject (6 videos)

---

### Step 4: Schema.org Validator

**Tool**: https://validator.schema.org

**Steps for Each Page**:
1. Visit the page in browser
2. View page source (Ctrl+U / Cmd+U)
3. Copy the entire HTML
4. Go to https://validator.schema.org
5. Select "Code Snippet" tab
6. Paste HTML
7. Click "Run Test"
8. Check for 0 errors

**Pages to Validate**:
- [ ] Homepage (/)
- [ ] /reel
- [ ] /film
- [ ] /edit
- [ ] /shorts

---

### Step 5: Open Graph Testing

**Tool**: https://www.opengraph.xyz

**Test Each Page**:

1. **Homepage**: https://adisaduke.vercel.app
   - [ ] Title: "Adisa Duke - Cinematographer & Director of Photography"
   - [ ] Description present
   - [ ] Image: /og/og-home.jpg (1200x630)
   - [ ] URL: https://adisaduke.vercel.app
   - [ ] Type: website

2. **/reel**: https://adisaduke.vercel.app/reel
   - [ ] Title: "Featured Reel - Award-Winning Cinematography | Adisa Duke"
   - [ ] Image: /og/og-reel.jpg

3. **/film**: https://adisaduke.vercel.app/film
   - [ ] Title: "Brand Video Production & Commercial Cinematography | Adisa Duke"
   - [ ] Image: /og/og-film.jpg

4. **/edit**: https://adisaduke.vercel.app/edit
   - [ ] Title: "Editorial Cinematography & Documentary Storytelling | Adisa Duke"
   - [ ] Image: /og/og-edit.jpg

5. **/shorts**: https://adisaduke.vercel.app/shorts
   - [ ] Title: "Short Form Video Content & Social Media Production | Adisa Duke"
   - [ ] Image: /og/og-shorts.jpg

6. **/about**: https://adisaduke.vercel.app/about
   - [ ] Title: "About Adisa Duke - Award-Winning Director of Photography"
   - [ ] Image: /og/og-about.jpg

7. **/contact**: https://adisaduke.vercel.app/contact
   - [ ] Title: "Contact Adisa Duke - Hire Professional Cinematographer & DP"
   - [ ] Image: /og/og-contact.jpg

**Note**: OG images will show placeholder until created (see OG_IMAGES_SPEC.md)

---

### Step 6: Twitter Card Validator

**Tool**: https://cards-dev.twitter.com/validator

**Test Each Page** (same 7 URLs as above):
- [ ] Homepage
- [ ] /reel
- [ ] /film
- [ ] /edit
- [ ] /shorts
- [ ] /about
- [ ] /contact

**What to Check**:
- Card type: summary_large_image
- Title matches Open Graph
- Description present
- Image reference present

---

## Phase 2: Performance Testing (Day 3-4)

### Step 1: Lighthouse Audits

**Tool**: Chrome DevTools → Lighthouse

**Target Scores** (All pages should achieve):
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

**Pages to Test**:

#### 1. Homepage (/)
```
Steps:
1. Open https://adisaduke.vercel.app in Chrome
2. Open DevTools (F12)
3. Click "Lighthouse" tab
4. Select: Mobile, All categories
5. Click "Analyze page load"
6. Record scores
```

**Expected Scores**:
- [ ] Performance: ___/100 (target: 90+)
- [ ] Accessibility: ___/100 (target: 90+)
- [ ] Best Practices: ___/100 (target: 90+)
- [ ] SEO: ___/100 (target: 95+)

#### 2. /reel
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

#### 3. /film
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

#### 4. /edit
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

#### 5. /shorts
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

#### 6. /about
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

#### 7. /contact
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

---

### Step 2: PageSpeed Insights

**Tool**: https://pagespeed.web.dev

Test the same 7 pages, record:
- Field Data (if available)
- Lab Data scores
- Core Web Vitals:
  - LCP (Largest Contentful Paint): Target <2.5s
  - FID (First Input Delay): Target <100ms
  - CLS (Cumulative Layout Shift): Target <0.1

---

### Step 3: Manual Performance Check

**Test Video Loading**:
1. Open homepage
2. Open DevTools → Network tab
3. Filter: Images
4. Scroll page slowly
5. Verify: Images load as you scroll (lazy loading working)
6. Check: No images load off-screen

**Test Loading Skeletons**:
1. Open DevTools → Network tab
2. Throttle: Slow 3G
3. Navigate to /film
4. Verify: Loading skeleton appears before content
5. Verify: Smooth transition from skeleton to content

---

## Phase 3: Accessibility Testing (Day 5)

### Step 1: Keyboard Navigation

**Test on Each Page**:

1. **Tab Through Page**
   - [ ] Press Tab repeatedly
   - [ ] All interactive elements receive focus
   - [ ] Focus indicator clearly visible
   - [ ] Tab order is logical
   - [ ] Can reach all navigation items
   - [ ] Can reach all buttons/links

2. **Test Video Modal**
   - [ ] Tab to video thumbnail
   - [ ] Press Enter to open modal
   - [ ] Focus trapped in modal
   - [ ] Can close with Escape key
   - [ ] Focus returns to trigger element

3. **Test Contact Form**
   - [ ] Tab to all form fields
   - [ ] Can fill form with keyboard only
   - [ ] Can submit with Enter
   - [ ] Error messages accessible

---

### Step 2: Screen Reader Testing

**Tools**:
- Windows: NVDA (free)
- Mac: VoiceOver (built-in)

**Test Checklist**:
- [ ] Page title announced correctly
- [ ] Headings structure makes sense (H1, H2, H3)
- [ ] Links have descriptive text
- [ ] Images have alt text
- [ ] Form fields have labels
- [ ] Buttons announce their purpose
- [ ] Video thumbnails describe content

---

### Step 3: Color Contrast

**Tool**: https://webaim.org/resources/contrastchecker/

**Check**:
- [ ] Body text on background: 4.5:1 minimum
- [ ] Navigation text: 4.5:1 minimum
- [ ] Button text: 4.5:1 minimum
- [ ] Footer text: 4.5:1 minimum

**Or use**: Chrome DevTools → Lighthouse → Accessibility section

---

### Step 4: WCAG Automated Testing

**Tools**:
- axe DevTools (Chrome extension)
- WAVE (Chrome extension)

**Steps**:
1. Install axe DevTools
2. Open each page
3. Run axe scan
4. Fix any errors found
5. Repeat for all 7 pages

---

## Phase 4: Cross-Browser Testing (Day 6)

### Desktop Browsers

#### Chrome (Latest)
**Test on Windows/Mac**:
- [ ] Homepage loads
- [ ] All videos display thumbnails
- [ ] Video modal opens and plays
- [ ] Navigation works
- [ ] Contact form submits
- [ ] All portfolio pages render
- [ ] Loading skeletons appear

#### Firefox (Latest)
**Same tests as Chrome**:
- [ ] Homepage loads
- [ ] Videos work
- [ ] Modal works
- [ ] Navigation works
- [ ] Contact form works

#### Safari (Latest)
**Test on Mac**:
- [ ] Homepage loads
- [ ] Videos work
- [ ] Modal works
- [ ] Navigation works
- [ ] Contact form works

#### Edge (Latest)
**Test on Windows**:
- [ ] Homepage loads
- [ ] Videos work
- [ ] Modal works
- [ ] Navigation works
- [ ] Contact form works

---

### Mobile Browsers

#### iOS Safari (iPhone)
**Test**:
- [ ] Homepage loads correctly
- [ ] Mobile menu works
- [ ] Videos display correctly
- [ ] Video modal works on touch
- [ ] All pages responsive
- [ ] Contact form usable
- [ ] No horizontal scroll

#### Android Chrome
**Test**:
- [ ] Homepage loads correctly
- [ ] Mobile menu works
- [ ] Videos display correctly
- [ ] Video modal works on touch
- [ ] All pages responsive
- [ ] Contact form usable
- [ ] No horizontal scroll

---

### Responsive Breakpoints

**Test These Widths**:
- [ ] 375px (iPhone SE)
- [ ] 414px (iPhone Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1280px (Desktop)
- [ ] 1920px (Large Desktop)

**Check**:
- No horizontal scroll
- Text readable
- Images scale correctly
- Navigation accessible
- Videos display properly

---

## Phase 5: Functional Testing (Day 7)

### Contact Form Testing

**Test Submission**:
1. Fill out form with test data:
   - Name: "Test User"
   - Email: your-test-email@example.com
   - Message: "Testing contact form"
2. Click submit
3. Verify:
   - [ ] Success toast appears
   - [ ] Form clears
   - [ ] Email received (check inbox)
   - [ ] Email content correct

**Test Validation**:
- [ ] Empty name shows error
- [ ] Invalid email shows error
- [ ] Empty message shows error
- [ ] All fields required

---

### Video Playback Testing

**Test Each Video Type**:
1. Vimeo Videos (majority)
   - [ ] Thumbnail loads
   - [ ] Click opens modal
   - [ ] Video plays in modal
   - [ ] Controls work
   - [ ] Close button works

2. YouTube Videos (if any)
   - [ ] Same tests as Vimeo

**Test Pages**:
- [ ] Homepage (6 videos)
- [ ] /reel (5 videos)
- [ ] /film (all branded videos)
- [ ] /edit (all editorial videos)
- [ ] /shorts (short form videos)

---

### Navigation Testing

**Desktop Navigation**:
- [ ] All nav links work
- [ ] Hover states visible
- [ ] Active page highlighted
- [ ] Logo links to homepage
- [ ] Contact button works

**Mobile Navigation**:
- [ ] Hamburger menu opens
- [ ] All links accessible
- [ ] Menu closes on link click
- [ ] Menu closes on outside click

---

## Phase 6: Production Readiness (Day 7)

### Pre-Launch Checklist

**Build & Deploy**:
- [x] npm run build passes (0 errors)
- [x] All 29 routes generated
- [x] Sitemap.xml generated
- [x] Robots.txt generated
- [ ] Deployed to Vercel production
- [ ] Production URL works

**Environment**:
- [ ] All env variables set in Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL correct
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY correct
- [ ] RESEND_API_KEY configured
- [ ] Contact form email tested

**Content**:
- [ ] All 15+ videos playing
- [ ] All pages load correctly
- [ ] No 404 errors
- [ ] No broken links
- [ ] Images loading

---

## Optional: Analytics Setup

### Google Analytics 4

**Steps**:
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel env variables:
   - NEXT_PUBLIC_GA_MEASUREMENT_ID
4. Verify tracking in GA4 Real-time reports

**Guide**: See `GOOGLE_ANALYTICS_SETUP.md`

---

## Issues Log

Track any issues found during testing:

### Critical Issues (Must Fix Before Launch)
_None found yet_

### Major Issues (Should Fix)
_None found yet_

### Minor Issues (Nice to Fix)
_None found yet_

---

## Testing Report Template

```
# Testing Report - Week 4

Date: [Date]
Tester: [Name]
Build: Production

## SEO Testing
- Sitemap: PASS/FAIL
- Robots.txt: PASS/FAIL
- Rich Results: PASS/FAIL (__ schemas validated)
- Open Graph: PASS/FAIL (__ pages tested)

## Performance
- Lighthouse Average: __/100
- All pages >90: YES/NO
- Core Web Vitals: PASS/FAIL

## Accessibility
- WCAG AA: PASS/FAIL
- Keyboard Nav: PASS/FAIL
- Screen Reader: PASS/FAIL
- Color Contrast: PASS/FAIL

## Cross-Browser
- Chrome: PASS/FAIL
- Firefox: PASS/FAIL
- Safari: PASS/FAIL
- Edge: PASS/FAIL
- iOS Safari: PASS/FAIL
- Android Chrome: PASS/FAIL

## Functional
- Contact Form: PASS/FAIL
- Video Playback: PASS/FAIL
- Navigation: PASS/FAIL

## Overall Status: READY FOR LAUNCH / NEEDS WORK

Critical Issues: __
Major Issues: __
Minor Issues: __
```

---

## Next Steps After Testing

1. **If All Tests Pass**:
   - Create production deployment
   - Set up analytics (optional)
   - Monitor for 24 hours
   - Announce launch!

2. **If Issues Found**:
   - Document each issue
   - Prioritize by severity
   - Fix critical issues
   - Re-test fixed items
   - Launch when critical items resolved

---

**Ready to Begin Testing?**

Start with Phase 1 (SEO Testing) and work through each phase systematically. Document results as you go!

---

**Version**: 1.0
**Created**: December 1, 2025
**Target Completion**: December 8, 2025
