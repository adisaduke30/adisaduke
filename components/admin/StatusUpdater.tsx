'use client'

import { useState, useTransition } from 'react'
import { updateProjectStatus } from '@/app/actions/projects'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

type ProjectStatus = 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'

interface StatusUpdaterProps {
  projectId: string
  currentStatus: ProjectStatus
}

const statusLabels: Record<ProjectStatus, string> = {
  pending: 'Pending',
  pre_production: 'Pre-Production',
  shooting: 'Shooting',
  editing: 'Editing',
  review: 'In Review',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function StatusUpdater({ projectId, currentStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [status, setStatus] = useState<ProjectStatus>(currentStatus)

  const handleStatusChange = (newStatus: ProjectStatus) => {
    setStatus(newStatus)

    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus)

      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Project status changed to ${statusLabels[newStatus]}`,
        })
      } else {
        // Revert on error
        setStatus(currentStatus)
        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update project status',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-48 bg-background/50 border-border/50">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="pre_production">Pre-Production</SelectItem>
        <SelectItem value="shooting">Shooting</SelectItem>
        <SelectItem value="editing">Editing</SelectItem>
        <SelectItem value="review">In Review</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}
