'use client'

import { useEffect, useRef } from 'react'
import Player from '@vimeo/player'

interface VimeoPlayerProps {
  vimeoId: string
  autoplay?: boolean
  className?: string
}

export function VimeoPlayer({ vimeoId, autoplay = false, className = '' }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Vimeo player
    playerRef.current = new Player(containerRef.current, {
      id: parseInt(vimeoId),
      width: 640,
      responsive: true,
      autoplay: autoplay,
      byline: false,
      portrait: false,
      title: false,
    })

    // Cleanup on unmount
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
