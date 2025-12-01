import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Video, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            Duke <span className="text-primary">Studios</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium production studio management platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              <Video className="mr-2 h-4 w-4" />
              Client Portal
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Request Booking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
