'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings,
} from 'lucide-react'

interface SidebarProps {
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

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const links = role === 'admin' ? adminLinks : clientLinks

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-card/30">
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid gap-1 px-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
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
      </div>
    </aside>
  )
}
