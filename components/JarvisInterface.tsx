'use client'

import { useState, useRef } from 'react'
import { JarvisHUD } from './JarvisHUD'
import ChatPanel from './ChatPanel'
import VoiceControl from './VoiceControl'
import { motion } from 'framer-motion'

export default function JarvisInterface() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return

    // Add user message
    const userMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Get AI response
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          userId: 'anonymous',
        }),
      })

      const data = await response.json()
      
      if (data.reply) {
        const assistantMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Speak response if available
        if (data.audio && audioRef.current) {
          console.log('[v0] Playing audio response')
          audioRef.current.src = data.audio
          audioRef.current.play().catch((error) => {
            console.error('[v0] Audio playback error:', error)
          })
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} />

      {/* 3D HUD Background */}
      <div className="absolute inset-0 z-0">
        <JarvisHUD />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 flex justify-between items-center pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-bold text-lg">JARVIS</span>
          </div>


        </motion.div>

        {/* Main Content Container */}
        <div className="h-full flex flex-col pointer-events-auto">
          {/* Chat Panel */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel messages={messages} loading={loading} />
          </div>

          {/* Voice Control */}
          <div className="p-6">
            <VoiceControl
              onTranscript={handleVoiceInput}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
