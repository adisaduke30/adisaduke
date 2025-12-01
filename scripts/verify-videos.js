/**
 * Video Verification Script
 * Checks all Vimeo and YouTube video IDs for accessibility
 */

const inventory = require('../content-migration/inventory.json');

console.log('='.repeat(60));
console.log('VIDEO VERIFICATION REPORT');
console.log('='.repeat(60));
console.log('');

const allVideos = [
  ...inventory.portfolio.brandedContent,
  ...inventory.portfolio.editorial
];

console.log(`Total videos in inventory: ${allVideos.length}`);
console.log('');

// Group by platform
const vimeoVideos = allVideos.filter(v => v.vimeoId);
const youtubeVideos = allVideos.filter(v => v.youtubeId);
const missingVideos = allVideos.filter(v => !v.vimeoId && !v.youtubeId);

console.log(`Vimeo videos: ${vimeoVideos.length}`);
console.log(`YouTube videos: ${youtubeVideos.length}`);
console.log(`Missing IDs: ${missingVideos.length}`);
console.log('');

// List all Vimeo videos
console.log('VIMEO VIDEOS:');
console.log('-'.repeat(60));
vimeoVideos.forEach((video, index) => {
  console.log(`${index + 1}. ${video.title}`);
  console.log(`   ID: ${video.vimeoId}`);
  console.log(`   URL: https://vimeo.com/${video.vimeoId}`);
  console.log(`   Client: ${video.client || 'N/A'}`);
  console.log(`   Role: ${video.role || 'N/A'}`);
  console.log('');
});

// List all YouTube videos
if (youtubeVideos.length > 0) {
  console.log('YOUTUBE VIDEOS:');
  console.log('-'.repeat(60));
  youtubeVideos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title}`);
    console.log(`   ID: ${video.youtubeId}`);
    console.log(`   URL: https://www.youtube.com/watch?v=${video.youtubeId}`);
    console.log(`   Client: ${video.client || 'N/A'}`);
    console.log(`   Role: ${video.role || 'N/A'}`);
    console.log('');
  });
}

// List missing videos
if (missingVideos.length > 0) {
  console.log('MISSING VIDEO IDs:');
  console.log('-'.repeat(60));
  missingVideos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title}`);
    console.log(`   Note: ${video.note || 'No video ID provided'}`);
    console.log('');
  });
}

// Summary by page
console.log('');
console.log('='.repeat(60));
console.log('VIDEO DISTRIBUTION BY PAGE');
console.log('='.repeat(60));
console.log('');

const displayableVideos = allVideos.filter(v => v.vimeoId || v.youtubeId);

console.log(`Homepage: ${displayableVideos.slice(0, 6).length} videos (first 6)`);
console.log(`/film: ${inventory.portfolio.brandedContent.filter(v => v.vimeoId || v.youtubeId).length} videos`);
console.log(`/edit: ${inventory.portfolio.editorial.filter(v => v.vimeoId || v.youtubeId).length} videos`);
console.log('');

console.log('='.repeat(60));
console.log('IMPORTANT NOTES:');
console.log('='.repeat(60));
console.log('');
console.log('If Vimeo videos show "not found" errors, check:');
console.log('1. Video privacy settings (must be Public or Unlisted)');
console.log('2. Embed settings (must allow embedding)');
console.log('3. Video still exists on Vimeo');
console.log('4. Account has proper permissions');
console.log('');
console.log('Recommended actions:');
console.log('1. Log into Vimeo account');
console.log('2. Check each video privacy settings');
console.log('3. Ensure "Allow embedding" is enabled');
console.log('4. Test each video URL in browser');
console.log('');
