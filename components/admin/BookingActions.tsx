'use client'

import { useState, useTransition } from 'react'
import { updateBookingStatus } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BookingActionsProps {
  bookingId: string
}

export function BookingActions({ bookingId }: BookingActionsProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [declineNotes, setDeclineNotes] = useState('')
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)

  const handleApprove = () => {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, 'approved')

      if (result.success) {
        toast({
          title: 'Booking Approved',
          description: 'The booking has been approved successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to approve booking',
          variant: 'destructive',
        })
      }
    })
  }

  const handleDecline = () => {
    startTransition(async () => {
      const result = await updateBookingStatus(
        bookingId,
        'declined',
        declineNotes || undefined
      )

      if (result.success) {
        toast({
          title: 'Booking Declined',
          description: 'The booking has been declined',
        })
        setShowDeclineDialog(false)
        setDeclineNotes('')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to decline booking',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={handleApprove} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        Approve Booking
      </Button>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex-1" disabled={isPending}>
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Booking Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this booking request? You can optionally add a note explaining why.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="decline-notes">Admin Notes (Optional)</Label>
            <Textarea
              id="decline-notes"
              value={declineNotes}
              onChange={(e) => setDeclineNotes(e.target.value)}
              placeholder="Reason for declining..."
              rows={3}
              className="bg-background/50 border-border/50 resize-none"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDecline()
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Declining...
                </>
              ) : (
                'Decline Booking'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
