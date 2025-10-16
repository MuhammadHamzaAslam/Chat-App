import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface User {
  _id: string
  user_name: string
  email: string
  avatar?: string
  isOnline: boolean
  lastActive: string
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

interface ChatListItemProps {
  conversation: Conversation
  currentUser: User
  onClick: () => void
}

export function ChatListItem({ conversation, currentUser, onClick }: ChatListItemProps) {
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id)
  
  if (!otherParticipant) return null

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const truncateMessage = (message: string, maxLength: number = 40) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  // Mock unread count - in real app, this would come from the conversation data
  const unreadCount = Math.floor(Math.random() * 5)

  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors group"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.user_name} />
          <AvatarFallback className="bg-slate-600 text-white">
            {otherParticipant.user_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {otherParticipant.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
            {otherParticipant.user_name}
          </h4>
          {conversation.lastMessage && (
            <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
              {formatTime(conversation.lastMessage.sentAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-slate-400 truncate">
            {conversation.lastMessage ? (
              conversation.lastMessage.sender._id === currentUser._id ? (
                <span className="text-slate-500">You: {truncateMessage(conversation.lastMessage.content)}</span>
              ) : (
                truncateMessage(conversation.lastMessage.content)
              )
            ) : (
              <span className="text-slate-500 italic">No messages yet</span>
            )}
          </p>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-blue-600 text-white text-xs px-2 py-0.5 ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
