'use client'

import { useState, useTransition } from 'react'
import { createBooking } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BookingFormProps {
  userEmail: string
  userName: string
}

export function BookingForm({ userEmail, userName }: BookingFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    desired_date: '',
    project_type: '',
    message: '',
    budget_range: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.desired_date || !formData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      const result = await createBooking(formData)

      if (result.success) {
        toast({
          title: 'Booking Submitted',
          description: 'Your booking request has been submitted successfully!',
        })

        // Reset form
        setFormData({
          name: userName,
          email: userEmail,
          desired_date: '',
          project_type: '',
          message: '',
          budget_range: '',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit booking request',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project_type">Project Type</Label>
        <Input
          id="project_type"
          value={formData.project_type}
          onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
          placeholder="e.g., Commercial, Editorial, Short Film"
          className="bg-background/50 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Project Description *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your project needs..."
          rows={4}
          className="bg-background/50 border-border/50 resize-none"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desired_date">Preferred Date *</Label>
        <Input
          id="desired_date"
          type="date"
          value={formData.desired_date}
          onChange={(e) => setFormData({ ...formData, desired_date: e.target.value })}
          className="bg-background/50 border-border/50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Budget Range</Label>
        <Input
          id="budget_range"
          value={formData.budget_range}
          onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
          placeholder="e.g., $10,000 - $25,000"
          className="bg-background/50 border-border/50"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Submit Booking Request
          </>
        )}
      </Button>
    </form>
  )
}
