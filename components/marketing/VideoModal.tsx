'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VideoPlayer } from './VideoPlayer'
import { X } from 'lucide-react'

interface Video {
  title: string
  vimeoId?: string | null
  youtubeId?: string
  role?: string
  client?: string
  category: string
}

interface VideoModalProps {
  video: Video | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoModal({ video, open, onOpenChange }: VideoModalProps) {
  if (!video || (!video.vimeoId && !video.youtubeId)) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 bg-black border-none">
        <DialogTitle className="sr-only">{video.title}</DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative">
          <VideoPlayer video={video} autoplay={true} />

          <div className="bg-black p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {video.client && (
                <span>
                  <span className="font-semibold">Client:</span> {video.client}
                </span>
              )}
              {video.role && (
                <span>
                  <span className="font-semibold">Role:</span> {video.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
