import { ReactNode, Suspense } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'
import { NotificationCenterWrapper } from './NotificationCenterWrapper'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: ReactNode
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'client'
    avatar_url?: string
  }
}

function NotificationFallback() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5 animate-pulse" />
    </Button>
  )
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-2 md:hidden p-4 border-b border-border/40">
        <MobileNav role={user.role} />
        <span className="font-bold text-lg tracking-tight">
          Duke <span className="text-primary">Studios</span>
        </span>
      </div>
      <Header
        user={user}
        notificationCenter={
          <Suspense fallback={<NotificationFallback />}>
            <NotificationCenterWrapper />
          </Suspense>
        }
      />
      <div className="flex flex-1">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
