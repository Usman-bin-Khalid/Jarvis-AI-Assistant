'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { MdDelete, MdArrowRight } from 'react-icons/md'

interface ConversationItem {
  id: string
  title: string
  created_at: string
  message_count?: number
}

export default function ConversationHistory({
  userId,
  onSelectConversation,
}: {
  userId: string
  onSelectConversation: (id: string) => void
}) {
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('id, title, created_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setConversations(data || [])
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchConversations()
    }
  }, [userId, supabase])

  const handleDelete = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', userId)

      if (error) throw error
      setConversations(conversations.filter((c) => c.id !== conversationId))
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-primary text-sm">Loading history...</div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground text-sm text-center">
          <p>No conversations yet</p>
          <p className="text-xs mt-2">Start a new conversation with JARVIS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-96 pr-2">
      {conversations.map((conversation) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center justify-between p-3 rounded-lg bg-card/20 border border-primary/10 hover:border-primary/30 hover:bg-card/30 cursor-pointer transition-all"
        >
          <button
            onClick={() => onSelectConversation(conversation.id)}
            className="flex-1 text-left flex items-center gap-2 min-w-0"
          >
            <MdArrowRight className="text-primary/50 group-hover:text-primary text-sm flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground truncate">
                {conversation.title || 'Untitled'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.created_at).toLocaleDateString()}
              </p>
            </div>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(conversation.id)
            }}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete conversation"
          >
            <MdDelete size={16} className="text-destructive hover:text-destructive/80" />
          </button>
        </motion.div>
      ))}
    </div>
  )
}
