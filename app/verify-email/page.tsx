'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Mail, CheckCircle2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || null)
        if (data.user.email_confirmed_at) {
          router.push('/dashboard')
        }
      }
    })
  }, [router])

  const handleResendVerification = async () => {
    if (!email) return

    setResending(true)
    try {
      const supabase = createClient()
      await supabase.auth.resend({
        type: 'signup',
        email,
      })
      setResent(true)
    } catch (error) {
      console.error('Failed to resend verification:', error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We sent a verification link to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account and start using Duke Studios.
              </p>
            </div>
          </div>

          {resent ? (
            <p className="text-sm text-center text-primary bg-primary/10 border border-primary/20 rounded-md p-3">
              Verification email resent successfully
            </p>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Didn&apos;t receive the email?
              </p>
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-border/50">
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
