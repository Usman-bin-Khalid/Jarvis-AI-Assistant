'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdMic, MdMicOff } from 'react-icons/md'

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export default function VoiceControl({
  onTranscript,
  disabled,
}: {
  onTranscript: (transcript: string) => void
  disabled: boolean
}) {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.language = 'en-US'

        recognitionRef.current.onstart = () => {
          console.log('[v0] Speech recognition started')
          setIsListening(true)
          setInterimTranscript('')
          setErrorMessage('')
          finalTranscriptRef.current = ''
        }

        recognitionRef.current.onresult = (event: any) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              console.log('[v0] Final transcript:', transcript)
              finalTranscriptRef.current += transcript + ' '
            } else {
              interim += transcript
            }
          }
          setInterimTranscript(interim)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.warn('[v0] Speech recognition error:', event.error)
          setIsListening(false)

          switch (event.error) {
            case 'not-allowed':
            case 'service-not-allowed':
              setErrorMessage(
                'Microphone access is blocked. Allow mic permission in your browser, then try again.'
              )
              break
            case 'no-speech':
              setErrorMessage('No speech detected. Please try again.')
              break
            case 'audio-capture':
              setErrorMessage('No microphone found. Please connect a mic and try again.')
              break
            case 'network':
              setErrorMessage('Network error during speech recognition. Check your connection.')
              break
            case 'aborted':
              // User-initiated stop — not an error worth showing.
              break
            default:
              setErrorMessage('Speech recognition failed. Please try again.')
          }
        }

        recognitionRef.current.onend = () => {
          console.log('[v0] Speech recognition ended')
          setIsListening(false)
          const finalText = finalTranscriptRef.current.trim()
          if (finalText) {
            console.log('[v0] Sending transcript:', finalText)
            setTranscript(finalText)
            onTranscript(finalText)
            finalTranscriptRef.current = ''
            setTranscript('')
            setInterimTranscript('')
          }
        }
      } else {
        console.warn('[v0] Speech Recognition API not supported')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [onTranscript])

  const handleMicClick = async () => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    if (isListening) {
      console.log('[v0] Stopping speech recognition')
      recognitionRef.current.stop()
      return
    }

    // Proactively request mic permission so the browser shows a clear prompt
    // and we can surface a helpful message if it's blocked.
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // We only needed the permission; release the tracks immediately.
        stream.getTracks().forEach((track) => track.stop())
      } catch (error: any) {
        console.warn('[v0] Microphone permission denied:', error)
        // "Permission denied by system" means the OS is blocking the browser
        // itself (e.g. macOS System Settings → Privacy → Microphone).
        if (typeof error?.message === 'string' && error.message.toLowerCase().includes('system')) {
          setErrorMessage(
            'Your browser is blocked from using the mic at the system level. On macOS: System Settings → Privacy & Security → Microphone → enable your browser, then restart it.'
          )
        } else {
          setErrorMessage(
            'Microphone access is blocked. Click the camera/lock icon in your browser address bar to allow the mic, then try again.'
          )
        }
        return
      }
    }

    console.log('[v0] Starting speech recognition')
    setErrorMessage('')
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.warn('[v0] Error starting recognition:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Interim Transcript Display */}
      {interimTranscript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl px-4 py-3 bg-card/40 border border-primary/20 rounded-lg text-center text-foreground text-sm italic opacity-70"
        >
          {interimTranscript}
        </motion.div>
      )}

      {/* Mic Button */}
      <motion.button
        onClick={handleMicClick}
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
          isListening
            ? 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50'
            : 'bg-card border-2 border-primary/30 hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute inset-0 rounded-full ${
            isListening ? 'animate-pulse-glow' : ''
          }`}
        />

        <div className="relative z-10 text-foreground">
          {isListening ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <MdMic size={24} />
            </motion.div>
          ) : (
            <MdMicOff size={24} />
          )}
        </div>

        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-primary/50"
            />
            <motion.div
              animate={{ scale: [1, 2] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="absolute inset-0 rounded-full border border-primary/25"
            />
          </>
        )}
      </motion.button>

      {/* Status Text */}
      <p className="text-sm text-muted-foreground text-center">
        {isListening ? (
          <span className="text-primary font-semibold">Listening...</span>
        ) : (
          'Click microphone to speak'
        )}
      </p>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-center text-destructive text-sm"
        >
          {errorMessage}
        </motion.div>
      )}
    </div>
  )
}
