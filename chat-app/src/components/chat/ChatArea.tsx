import React from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface User {
  _id: string
  user_name: string
  email: string
  avatar?: string
  isOnline: boolean
  lastActive: string
}

interface Message {
  _id: string
  content: string
  sender: User
  sentAt: string
  readBy: string[]
  isEdited?: boolean
  editedAt?: string
}

interface Conversation {
  _id: string
  participants: User[]
  lastMessage?: {
    _id: string
    content: string
    sender: User
    sentAt: string
  }
  updatedAt: string
}

interface ChatAreaProps {
  currentUser: User
  conversation: Conversation
  onSendMessage: (conversationId: string, content: string) => void
  onBack?: () => void
}

export function ChatArea({ currentUser, conversation, onSendMessage, onBack }: ChatAreaProps) {
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id)
  
  if (!otherParticipant) return null

  const handleSendMessage = (content: string) => {
    onSendMessage(conversation._id, content)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <ChatHeader 
        user={otherParticipant} 
        onBack={onBack}
      />
      
      <MessageList 
        currentUser={currentUser}
        conversationId={conversation._id}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
