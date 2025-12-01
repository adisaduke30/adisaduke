'use client'

import { useState } from 'react'
import { getFileDownloadUrl } from '@/app/actions/files'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DownloadFileButtonProps {
  fileId: string
  fileName: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function DownloadFileButton({ fileId, fileName, variant = 'ghost', size = 'sm' }: DownloadFileButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const result = await getFileDownloadUrl(fileId)

      if (result.success && result.data?.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = result.data.url
        link.download = result.data.fileName || fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: 'Download Started',
          description: `Downloading ${fileName}`,
        })
      } else {
        toast({
          title: 'Download Failed',
          description: result.error || 'Failed to generate download link',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  )
}
