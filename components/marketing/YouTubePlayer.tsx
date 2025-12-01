'use client'

interface YouTubePlayerProps {
  youtubeId: string
  autoplay?: boolean
  className?: string
}

export function YouTubePlayer({ youtubeId, autoplay = false, className = '' }: YouTubePlayerProps) {
  // YouTube embed URL with parameters
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
