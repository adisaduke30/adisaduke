# Vimeo Video Setup & Troubleshooting

**Date**: December 1, 2025
**Issue**: Some Vimeo videos showing "not found" errors
**Affected Video**: HP Sprocket 3x4 (ID: 727757228)

---

## Problem Summary

The error message **"https://vimeo.com/727757228" was not found** indicates that this Vimeo video is not publicly accessible or has embedding restrictions.

### Possible Causes

1. **Video Privacy**: Set to "Private" instead of "Public" or "Unlisted"
2. **Embedding Disabled**: Embedding not allowed in video settings
3. **Video Deleted**: Video no longer exists on Vimeo
4. **Account Permissions**: Video belongs to different account or requires login

---

## All Videos in Portfolio

### Vimeo Videos (14 total)

1. **HP Sprocket 3x4** - `727757228` ⚠️ **REPORTED ERROR**
2. Puma Suede Classics: Men's - `683936434`
3. Puma Suede Classics: Unisex - `683938274`
4. Puma Suede Classics: Group - `703279064`
5. Golden Grooming - `342470080`
6. Nike Black History Month Recap 2020 - `406260664`
7. Nike Black History Month Day in the Life - `410466618`
8. Nike Air Max 2090 - `402709883`
9. College Athlete Advocacy Initiative - `703284936`
10. Kreyól Essence - `703284803`
11. BABEL & The William Vale - `233230503`
12. Semilla Nueva: Who We Are - `234754434`
13. DIOP - `294658793`
14. Vimeo Stories in Place - `515302320`

### YouTube Videos (1 total)

1. YouTube Project - `kH2cMs28pBY`

### Missing Videos (1 total)

1. Bandier Collection 2 - No video ID (confirmed unavailable)

---

## Required Actions

### Step 1: Log Into Vimeo

1. Go to https://vimeo.com
2. Log into the account that owns these videos
3. Navigate to your video library

### Step 2: Check HP Sprocket 3x4 Video

**Direct URL**: https://vimeo.com/727757228

**Check if**:
- [ ] Video still exists
- [ ] You can see it when logged in
- [ ] Video shows "Private" or "Public" label

### Step 3: Update Privacy Settings (for ALL 14 videos)

For each Vimeo video:

1. Click on the video
2. Go to **Settings** (gear icon)
3. Click **Privacy** tab
4. Set privacy to **"Anyone"** or **"Unlisted"**
   - ✅ **Anyone**: Video is publicly visible (recommended)
   - ✅ **Unlisted**: Video accessible via link only
   - ❌ **Private**: Video NOT accessible (will cause errors)

### Step 4: Enable Embedding (for ALL 14 videos)

For each video:

1. In video **Settings** → **Privacy** tab
2. Find **"Where can this video be embedded?"** section
3. Set to **"Everywhere"** (recommended)
   - ✅ **Everywhere**: Can be embedded on any site
   - ⚠️ **Specific domains**: Must add `adisaduke.com` or `vercel.app`
   - ❌ **Nowhere**: Will cause embedding errors

### Step 5: Verify Each Video

Test each video URL in an incognito browser window:

```
https://vimeo.com/727757228  ← HP Sprocket
https://vimeo.com/683936434  ← Puma Men's
https://vimeo.com/683938274  ← Puma Unisex
https://vimeo.com/703279064  ← Puma Group
https://vimeo.com/342470080  ← Golden Grooming
https://vimeo.com/406260664  ← Nike Recap
https://vimeo.com/410466618  ← Nike Day in Life
https://vimeo.com/402709883  ← Nike Air Max
https://vimeo.com/703284936  ← College Athlete
https://vimeo.com/703284803  ← Kreyól Essence
https://vimeo.com/233230503  ← BABEL
https://vimeo.com/234754434  ← Semilla Nueva
https://vimeo.com/294658793  ← DIOP
https://vimeo.com/515302320  ← Vimeo Stories
```

**Expected Result**: Each video should load and show an embed option

---

## Recommended Vimeo Settings

### Privacy Settings (per video)

```
Privacy: Anyone (or Unlisted)
Where can this video be embedded?: Everywhere
Who can add video to collections?: Anyone
Who can add this video to Channels?: No one (or as desired)
```

### Privacy Settings to AVOID

❌ **Privacy: Private** - Video won't be accessible
❌ **Privacy: Only me** - Video won't be accessible
❌ **Embedding: Nowhere** - Video won't embed
❌ **Embedding: Specific domains** - Must configure domains correctly

---

## Bulk Update Instructions

If you have many videos to update:

1. Go to https://vimeo.com/manage/videos
2. Select multiple videos (checkbox)
3. Click **"Edit"** → **"Privacy"**
4. Update all selected videos at once:
   - Privacy: **Anyone**
   - Embedding: **Everywhere**
5. Click **"Save"**

---

## How Videos Appear on Site

### Homepage (/)
- Shows first 6 videos from combined portfolio
- Currently: HP Sprocket, Puma Men's, Puma Unisex, Puma Group, Golden Grooming, Nike Recap

### Branded Content (/film)
- Shows all 11 branded videos with valid IDs
- Grouped by client (Nike, Puma, Other)

### Editorial (/edit)
- Shows all 4 editorial videos
- Includes 1 YouTube video (YouTube Project)

### Featured Reel (/reel)
- Shows 5 hand-picked videos
- Includes HP Sprocket (if accessible)

### Shorts (/shorts)
- Shows 1 featured video (Nike Day in Life)

---

## Testing After Fix

### Test on Development Server

1. Start dev server: `npm run dev`
2. Open: http://localhost:3000
3. Click each video thumbnail
4. Verify video plays in modal

### Test on Production (After Deploy)

1. Open: https://adisaduke.vercel.app (or custom domain)
2. Test all pages:
   - Homepage: Click 6 videos
   - /film: Click all 11 videos
   - /edit: Click all 4 videos (including YouTube)
   - /reel: Click 5 videos
   - /shorts: Click featured video

---

## Alternative Solutions

### Option 1: Remove Problem Video

If a video can't be made public:

1. Remove from `content-migration/inventory.json`
2. Rebuild site
3. Video won't display anywhere

### Option 2: Replace Video ID

If video was re-uploaded:

1. Find new Vimeo ID
2. Update ID in `content-migration/inventory.json`
3. Ensure new video has proper privacy settings

### Option 3: Use Different Platform

If Vimeo restrictions are problematic:

1. Upload video to YouTube
2. Add `youtubeId` field to inventory
3. Site now supports both platforms

---

## Technical Details

### How Video Embedding Works

1. **Thumbnail Loading**:
   - Vimeo: `https://vumbnail.com/{vimeoId}.jpg`
   - YouTube: `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`

2. **Video Playback**:
   - Vimeo: Uses @vimeo/player SDK
   - YouTube: Uses iframe embed

3. **Privacy Requirements**:
   - Video must be "Public" or "Unlisted"
   - Embedding must be enabled
   - No password protection
   - No domain restrictions (or domain whitelisted)

### Error Types

- **"Video not found"**: Privacy set to Private, or video deleted
- **"Embedding disabled"**: Embedding not allowed in settings
- **"Sorry, this video is private"**: Video requires login to view
- **"This video doesn't exist"**: Video ID incorrect or video deleted

---

## Code Changes Made

### Fixed Homepage Filter

**Before** (Vimeo only):
```typescript
.filter((video) => video.vimeoId !== null)
```

**After** (Vimeo + YouTube):
```typescript
.filter((video) => video.vimeoId || video.youtubeId)
```

**Impact**: Homepage now supports both platforms and displays YouTube video if present

---

## Verification Script

A script has been created to verify all video IDs:

```bash
node scripts/verify-videos.js
```

**Output**:
- List of all 14 Vimeo videos with URLs
- List of all 1 YouTube videos with URLs
- List of all 1 missing videos
- Video distribution by page

---

## Support

If issues persist after following these steps:

1. **Screenshot Vimeo Settings**: Take screenshot of privacy settings for problem video
2. **Test in Incognito**: Verify video accessible without login
3. **Check Console**: Open browser DevTools console for error messages
4. **Report Details**: Note which specific videos have issues

---

## Quick Checklist

For Adisa to complete:

- [ ] Log into Vimeo account
- [ ] Go to video library
- [ ] For each of 14 videos:
  - [ ] Set Privacy to "Anyone" or "Unlisted"
  - [ ] Set Embedding to "Everywhere"
  - [ ] Save changes
- [ ] Test HP Sprocket video first (727757228)
- [ ] Test each video URL in incognito window
- [ ] Verify all videos load without "not found" errors
- [ ] Test videos on development site (npm run dev)
- [ ] Confirm all videos play in modal

---

**Once Vimeo settings are updated, all videos should work correctly on the site!**
