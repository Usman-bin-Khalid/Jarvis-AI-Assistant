import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GCP_API_KEY,
})


export async function POST(request: Request) {
  const { message } = await request.json()

  if (!message) {
    return Response.json(
      { error: 'Message is required' },
      { status: 400 }
    )
  }

  try {
    console.log('[v0] Calling Gemini API with message:', message)
    let reply: string

    try {
      const result = await generateText({
        model: google('gemini-2.5-flash'),
        system: `You are JARVIS, Tony Stark's Personal AI Assistant. You are sophisticated, witty, and highly knowledgeable about technology, science, and business. You speak with British mannerisms and maintain a professional yet friendly demeanor. You can help with questions about technology, provide information, assist with problem-solving, and engage in intelligent conversation. Keep responses concise but informative.`,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      })

      reply = result.text
      console.log('[v0] Gemini response:', reply)
    } catch (apiError) {
      console.warn('[v0] Gemini API error, using demo response:', apiError)
      // Fallback demo response
      reply = `Good morning, sir. I am JARVIS, your personal AI assistant. You asked: "${message}". I'm in demo mode. In production, I would provide a detailed response using Gemini AI.`
    }

    
     
    // Generate speech using ElevenLabs via our TTS endpoint
    let audioUrl = null
    try {
      const ttsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reply,
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Rachel voice (professional)
        }),
      })

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer()
        audioUrl = `data:audio/mpeg;base64,${Buffer.from(audioBuffer).toString('base64')}`
      }
    } catch (ttsError) {
      console.error('TTS error:', ttsError)
      // Continue without audio if TTS fails
    }

    return Response.json({
      reply,
      audio: audioUrl,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] Chat error:', errorMsg)
    console.error('[v0] Error details:', error)
    return Response.json(
      { error: 'Failed to generate response', details: errorMsg },
      { status: 500 }
    )
  }
}
