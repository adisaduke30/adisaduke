'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  Menu,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings,
  Video,
} from 'lucide-react'

interface MobileNavProps {
  role: 'admin' | 'client'
}

const clientLinks = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileText,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
]

const adminLinks = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    href: '/admin/clients',
    icon: Users,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: 'Invoices',
    href: '/admin/invoices',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function MobileNav({ role }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const links = role === 'admin' ? adminLinks : clientLinks

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b border-border/40 px-4">
          <Link href={role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">
              Duke <span className="text-primary">Studios</span>
            </span>
          </Link>
        </div>
        <nav className="grid gap-1 p-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.title}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
