'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatPanel({
  messages,
  loading,
}: {
  messages: any[]
  loading: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent via-card/5 to-transparent"
    >
      <AnimatePresence>
        {messages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center h-full text-center"
          >
            <div className="space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                JARVIS
              </div>
              <p className="text-muted-foreground max-w-md">
                Welcome. I&apos;m JARVIS, Tony Stark&apos;s Personal AI. Speak or type to interact with me.
              </p>
              <p className="text-primary text-sm">
                Click the microphone or press the activation button to begin
              </p>
            </div>
          </motion.div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg border ${
                msg.role === 'user'
                  ? 'bg-primary/10 border-primary/30 text-foreground'
                  : 'bg-card/40 border-secondary/30 text-foreground'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {msg.timestamp?.toLocaleTimeString() || ''}
              </p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-card/40 border border-secondary/30 px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
