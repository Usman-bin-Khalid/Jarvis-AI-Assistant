'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SignUpSuccess() {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    // Get email from URL or session
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="text-4xl">✉️</div>
            </div>
            <CardTitle className="text-2xl text-primary">Check Your Email</CardTitle>
            <CardDescription className="text-foreground/70">
              Email confirmation sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-center">
              <p className="text-foreground/80">
                We&apos;ve sent a confirmation link to:
              </p>
              <p className="font-semibold text-primary break-all">
                {email || 'your email address'}
              </p>
            </div>

            <div className="bg-card border border-primary/20 rounded-lg p-4 space-y-2 text-sm text-foreground/70">
              <p>
                <strong className="text-foreground">1. Check your inbox</strong> for the confirmation email
              </p>
              <p>
                <strong className="text-foreground">2. Click the link</strong> in the email to verify your account
              </p>
              <p>
                <strong className="text-foreground">3. You&apos;ll be redirected</strong> to JARVIS automatically
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-foreground/60 text-center">
                Can&apos;t find the email? Check your spam or promotions folder.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
              <Link href="/auth/sign-up" className="flex-1">
                <Button variant="outline" className="w-full">
                  Try Again
                </Button>
              </Link>
            </div>

            <p className="text-xs text-center text-foreground/50">
              This link will expire in 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
