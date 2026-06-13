import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GCP_API_KEY,
})

// Optional shared secret. If ELEVENLABS_TOOL_SECRET is set, the ElevenLabs
// tool must send it as the `x-tool-secret` header (configure it as a header
// on the server tool in the ElevenLabs dashboard).
const toolSecret = process.env.ELEVENLABS_TOOL_SECRET

const SYSTEM_PROMPT = `You are JARVIS, Tony Stark's Personal AI Assistant, acting as the deep-knowledge backend for a voice agent.
You are sophisticated, witty, and highly knowledgeable about technology, science, business, and general knowledge.
You speak with British mannerisms and a professional yet friendly demeanor.
Answer the user's question directly, accurately, and completely. The answer will be read aloud, so:
- Keep it clear and conversational (no markdown, no bullet symbols, no code fences).
- Be concise but complete — give the actual information, not a refusal.
- If something is genuinely uncertain, say so briefly and give your best answer.`

// CORS so the tool can be reached from anywhere ElevenLabs calls from.
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-tool-secret',
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(request: Request) {
  // Validate optional shared secret
  if (toolSecret) {
    const provided = request.headers.get('x-tool-secret')
    if (provided !== toolSecret) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      )
    }
  }

  let body: any = {}
  try {
    body = await request.json()
  } catch {
    // ignore — handled below
  }

  // Accept a few common field names so it's robust to how the tool is set up.
  const query: string =
    body?.query || body?.question || body?.message || body?.text || ''

  if (!query || typeof query !== 'string') {
    return Response.json(
      { error: 'A "query" string is required.' },
      { status: 400, headers: corsHeaders() }
    )
  }

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: query }],
    })

    const answer = result.text?.trim() || 'I was unable to find an answer, sir.'

    // ElevenLabs reads the returned JSON and feeds it back to the agent.
    return Response.json({ answer }, { headers: corsHeaders() })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[elevenlabs-tool] Gemini error:', errorMsg)
    return Response.json(
      {
        answer:
          'My apologies, sir — I could not reach my knowledge core just now. Please try again in a moment.',
        error: errorMsg,
      },
      { status: 200, headers: corsHeaders() }
    )
  }
}
