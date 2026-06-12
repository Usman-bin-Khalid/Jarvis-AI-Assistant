import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const errorMessage = params?.message || params?.error || 'An unspecified error occurred'

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border-destructive/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="text-4xl">⚠️</div>
            </div>
            <CardTitle className="text-2xl text-destructive">
              Authentication Error
            </CardTitle>
            <CardDescription>
              We encountered an issue with your request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80 break-words">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-3 text-sm text-foreground/70">
              <p><strong>Why this might happen:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>The link has expired (valid for 24 hours)</li>
                <li>The link has already been used</li>
                <li>Browser cookies are disabled</li>
                <li>Incorrect email address</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/auth/sign-up" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Try Creating Account Again
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>

            <p className="text-xs text-center text-foreground/50">
              If the problem persists, try clearing your browser cache and cookies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
