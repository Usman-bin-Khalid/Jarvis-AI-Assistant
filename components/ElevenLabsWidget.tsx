'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

// Tell TypeScript about the ElevenLabs custom element (React 19 uses React.JSX)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'agent-id': string
          transcript?: string
          'text-input'?: string
          variant?: string
        },
        HTMLElement
      >
    }
  }
}

const AGENT_ID = 'agent_4901ktt7j69pevaveq3jy68cgszg'

export default function ElevenLabsWidget() {
  const [mounted, setMounted] = useState(false)

  // Avoid SSR hydration issues with the custom element
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* ElevenLabs ConvAI embed script */}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        async
        strategy="afterInteractive"
      />

      {mounted && (
        <div className="jarvis-convai-wrapper">
          {/* Animated glow ring behind the widget */}
          <div className="jarvis-convai-glow" aria-hidden="true" />

          {/* Floating label */}
          <div className="jarvis-convai-label">
            <span className="jarvis-convai-dot" />
            Talk to JARVIS
          </div>

          {/* The actual ElevenLabs widget.
              transcript -> shows the sent/received chat messages
              text-input -> shows a text box so users can type as well as talk */}
          <elevenlabs-convai
            agent-id={AGENT_ID}
            transcript="true"
            text-input="true"
            variant="expanded"
          />
        </div>
      )}

      <style jsx global>{`
        .jarvis-convai-wrapper {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          pointer-events: none;
        }

        .jarvis-convai-wrapper > * {
          pointer-events: auto;
        }

        /* Pulsing aura behind the launcher */
        .jarvis-convai-glow {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 72px;
          height: 72px;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(0, 212, 255, 0.55) 0%,
            rgba(0, 212, 255, 0.15) 45%,
            rgba(0, 212, 255, 0) 70%
          );
          filter: blur(6px);
          animation: jarvis-convai-pulse 2.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes jarvis-convai-pulse {
          0%,
          100% {
            transform: scale(0.85);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        /* "Talk to JARVIS" pill */
        .jarvis-convai-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #00d4ff;
          background: rgba(10, 10, 20, 0.85);
          border: 1px solid rgba(0, 212, 255, 0.4);
          border-radius: 9999px;
          box-shadow: 0 0 18px rgba(0, 212, 255, 0.25),
            inset 0 0 8px rgba(0, 212, 255, 0.15);
          backdrop-filter: blur(8px);
          white-space: nowrap;
          animation: jarvis-convai-float 3.5s ease-in-out infinite;
          user-select: none;
        }

        @keyframes jarvis-convai-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .jarvis-convai-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #00ff88;
          box-shadow: 0 0 8px #00ff88;
          animation: jarvis-convai-blink 1.6s ease-in-out infinite;
        }

        @keyframes jarvis-convai-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }

        /* Hide the label on small screens to keep it clean */
        @media (max-width: 480px) {
          .jarvis-convai-label {
            display: none;
          }
          .jarvis-convai-wrapper {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </>
  )
}
