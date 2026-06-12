import { createClient } from './server'

export interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export async function createConversation(userId: string, title?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title: title || 'New Conversation',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getConversation(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getConversations(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
    })
    .select()
    .single()

  if (error) throw error

  // Update conversation's updated_at timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

export async function getMessages(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function deleteConversation(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function updateConversationTitle(
  conversationId: string,
  userId: string,
  title: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
