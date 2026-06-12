'use client'

import JarvisInterface from '@/components/JarvisInterface'

export default function DevPage() {
  // Development-only page to test JARVIS interface without authentication
  const mockUser = {
    id: 'dev-user-12345',
    email: 'dev@jarvis.ai',
    user_metadata: { name: 'Developer' },
  }

  return <JarvisInterface user={mockUser} />
}
