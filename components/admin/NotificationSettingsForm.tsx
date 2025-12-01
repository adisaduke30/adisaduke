'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

interface NotificationSettingsFormProps {
  userId: string
}

export function NotificationSettingsForm({ userId }: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState({
    emailNewMessage: true,
    emailNewBooking: true,
    emailProjectUpdate: true,
    emailPaymentReceived: true,
    emailNewFile: true,
  })
  const { toast } = useToast()

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      title: 'Settings Updated',
      description: 'Your notification preferences have been saved',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>New Messages</Label>
          <p className="text-sm text-muted-foreground">
            Receive email when you get a new message
          </p>
        </div>
        <Switch
          checked={settings.emailNewMessage}
          onCheckedChange={() => handleToggle('emailNewMessage')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>New Bookings</Label>
          <p className="text-sm text-muted-foreground">
            Receive email for new booking requests
          </p>
        </div>
        <Switch
          checked={settings.emailNewBooking}
          onCheckedChange={() => handleToggle('emailNewBooking')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Project Updates</Label>
          <p className="text-sm text-muted-foreground">
            Receive email when project status changes
          </p>
        </div>
        <Switch
          checked={settings.emailProjectUpdate}
          onCheckedChange={() => handleToggle('emailProjectUpdate')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Payment Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email when payments are received
          </p>
        </div>
        <Switch
          checked={settings.emailPaymentReceived}
          onCheckedChange={() => handleToggle('emailPaymentReceived')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>File Uploads</Label>
          <p className="text-sm text-muted-foreground">
            Receive email when new files are uploaded
          </p>
        </div>
        <Switch
          checked={settings.emailNewFile}
          onCheckedChange={() => handleToggle('emailNewFile')}
        />
      </div>
    </div>
  )
}
