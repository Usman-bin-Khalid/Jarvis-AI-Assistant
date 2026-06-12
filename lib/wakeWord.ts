/**
 * Simple wake word detection using text matching
 * For production, consider using PocketSphinx.js or similar
 */

export const WAKE_WORDS = ['jarvis', 'hey jarvis', 'alexa', 'assistant']

export function detectWakeWord(text: string): boolean {
  const normalized = text.toLowerCase().trim()
  return WAKE_WORDS.some(word => normalized.includes(word))
}

export function removeWakeWord(text: string): string {
  let result = text.toLowerCase()
  for (const word of WAKE_WORDS) {
    result = result.replace(word, '').trim()
  }
  return result
}

// Helper to extract speech confidence or certainty if available
export function getConfidenceLevel(isFinal: boolean): number {
  return isFinal ? 1.0 : 0.7
}
