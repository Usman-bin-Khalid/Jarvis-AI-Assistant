import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dev'

  if (code) {
    try {
      const supabase = await createClient()
      const { error, data } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[v0] Auth error:', error)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      if (data.session) {
        console.log('[v0] Session established for user:', data.user?.email)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('[v0] Unexpected error during auth:', err)
      return NextResponse.redirect(`${origin}/auth/error?message=Session exchange failed`)
    }
  }

  console.warn('[v0] No code provided to auth callback')
  return NextResponse.redirect(`${origin}/auth/error?message=No authorization code provided`)
}
