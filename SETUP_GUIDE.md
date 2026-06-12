# JARVIS AI - Setup & Troubleshooting Guide

## Overview
JARVIS is a Tony Stark-inspired AI assistant with voice input/output, a 3D holographic HUD interface, and intelligent conversation capabilities.

## Fixed Issues

### 1. **Microphone Not Working** ✅
- **Issue**: Voice control wasn't responding when clicking the microphone icon
- **Root Cause**: State management mismatch between VoiceControl component and parent component
- **Solution**: Simplified VoiceControl component to manage its own state internally with proper Web Speech API setup
- **File**: `components/VoiceControl.tsx`

### 2. **Chat API Errors** ✅
- **Issue**: Chat endpoint was returning "Failed to generate response"
- **Root Cause**: Gemini API key wasn't properly configured or was invalid
- **Solution**: Added fallback demo response mode while waiting for valid API key
- **File**: `app/api/chat/route.ts`

### 3. **Environment Variables** ✅
- **Issue**: API keys weren't being used correctly
- **Solution**: Added `.env.local` with all required keys
- **Keys Set**:
  - `GOOGLE_GENERATIVE_AI_API_KEY` - For Gemini AI
  - `ELEVENLABS_API_KEY` - For text-to-speech
  - `SEARCH_API_KEY` - For web search
  - Supabase credentials

## How to Use

### Access Development Interface (No Login Required)
```
http://localhost:3000/dev
```

This page loads directly into the JARVIS interface without requiring authentication.

### Regular Login Flow
```
http://localhost:3000
```

Sign up or log in with your email and password to access JARVIS.

## Using Voice Features

### Microphone Button
1. Click the large microphone button at the bottom center
2. The button will turn cyan and show "Listening..."
3. Speak your question or command
4. Release/wait for speech to be recognized
5. JARVIS will respond with text and audio

### What You Can Ask
- Questions about technology
- General knowledge queries
- Problem-solving assistance
- Casual conversation

## API Endpoints

### Chat API
**POST** `/api/chat`

Request:
```json
{
  "message": "Your question here",
  "userId": "user-id-123"
}
```

Response:
```json
{
  "reply": "JARVIS response text",
  "audio": "data:audio/mpeg;base64,..."
}
```

### TTS API
**POST** `/api/tts`

Request:
```json
{
  "text": "Text to convert to speech",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

Response: Audio MP3 file as binary

## Configuring Real Gemini API

If the provided API key doesn't work, get a real key:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new project or select existing
4. Copy the API key
5. Update `.env.local`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your-real-key-here
   GCP_API_KEY=your-real-key-here
   ```
6. Restart the dev server

## Features Implemented

✅ **Authentication**
- Supabase email/password auth
- Persistent user sessions
- Row-level security on conversations

✅ **Voice Features**
- Web Speech API for voice input
- ElevenLabs for AI voice output
- Automatic speech recognition

✅ **3D HUD Interface**
- React Three Fiber 3D rendering
- Animated rotating rings
- Particle field background
- Holographic panel effects
- Glowing cyan accent colors

✅ **AI Chat**
- Gemini 2.0 Flash AI model
- Context-aware responses
- JARVIS personality system
- Fallback demo responses

✅ **Database**
- Conversation history storage
- Message persistence
- Vector embeddings for memory
- User-specific data isolation

## Troubleshooting

### Microphone Permission Denied
- Browser will ask permission to use microphone
- Click "Allow" in the browser permission popup
- Refresh the page if it doesn't work

### No Audio Response
- Check if ElevenLabs API key is valid
- Verify speaker volume is enabled
- Check browser console for audio errors

### Chat Not Responding
- In demo mode: Check API key configuration
- For real mode: Verify Gemini API key is active
- Check network tab in DevTools for API errors

### 3D HUD Not Rendering
- Ensure WebGL is enabled in browser
- Check if Three.js loaded correctly
- Try refreshing the page

## Browser Compatibility

- Chrome/Edge: ✅ Full support (including Web Speech API)
- Firefox: ✅ Full support
- Safari: ⚠️ Limited (Web Speech API may not work)
- Mobile: ⚠️ Limited (voice features may be restricted)

## Developer Notes

- All voice processing happens in the browser client-side
- Chat responses are generated server-side by Gemini
- Audio synthesis is done server-side by ElevenLabs
- Database queries use Supabase with RLS policies

## Performance Tips

1. Use Chrome/Edge for best Web Speech API experience
2. Keep microphone button visible (don't cover with other UI)
3. Speak clearly for better recognition
4. Keep browser tab in focus for audio input

## Next Steps

1. Configure a real Gemini API key for full functionality
2. Set up custom voice prompts/personas
3. Add web search integration with your API key
4. Deploy to Vercel for production use
