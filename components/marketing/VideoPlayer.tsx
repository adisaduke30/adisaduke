'use client'

import { VimeoPlayer } from './VimeoPlayer'
import { YouTubePlayer } from './YouTubePlayer'

interface Video {
  title: string
  vimeoId?: string | null
  youtubeId?: string
  role?: string
  client?: string
  category: string
}

interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
  className?: string
}

export function VideoPlayer({ video, autoplay = false, className = '' }: VideoPlayerProps) {
  // Determine which player to use based on available IDs
  if (video.vimeoId) {
    return <VimeoPlayer vimeoId={video.vimeoId} autoplay={autoplay} className={className} />
  }

  if (video.youtubeId) {
    return <YouTubePlayer youtubeId={video.youtubeId} autoplay={autoplay} className={className} />
  }

  // Fallback: no valid video ID
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <p className="text-muted-foreground text-sm">Video not available</p>
    </div>
  )
}
