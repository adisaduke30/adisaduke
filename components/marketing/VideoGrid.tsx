'use client'

import { useState, useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { VideoModal } from './VideoModal'
import Image from 'next/image'

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

interface VideoGridProps {
  videos: Video[]
  showAll?: boolean
  limit?: number
}

export function VideoGrid({ videos, showAll = false, limit = 6 }: VideoGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const displayVideos = showAll ? videos : videos.slice(0, limit)

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayVideos.map((video, index) => (
          <VideoCard
            key={`${video.vimeoId || video.youtubeId}-${index}`}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>

      <VideoModal
        video={selectedVideo}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Skip videos without any valid ID
  if (!video.vimeoId && !video.youtubeId) {
    return null
  }

  // Determine thumbnail URL based on video type
  const thumbnailUrl = video.vimeoId
    ? `https://vumbnail.com/${video.vimeoId}.jpg`
    : `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <div
      ref={cardRef}
      className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Video Thumbnail */}
      {isVisible ? (
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      ) : (
        <div className="w-full h-full bg-muted animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted-foreground/10" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-foreground/80 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center text-background px-4">
          <div className="mb-4">
            <Play className="h-12 w-12 mx-auto" fill="currentColor" />
          </div>
          <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
          {video.client && (
            <p className="text-sm opacity-90 mb-1">{video.client}</p>
          )}
          {video.role && <p className="text-xs opacity-80">{video.role}</p>}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
        <h3 className="text-background font-medium text-sm">{video.title}</h3>
      </div>
    </div>
  )
}
