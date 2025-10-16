import React from 'react'
import { CheckCheck, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  showTime: boolean
}

export function MessageBubble({ message, isOwn, showAvatar, showTime }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getReadStatusIcon = () => {
    if (!isOwn) return null
    
    if (message.readBy.length > 0) {
      return <CheckCheck className="h-3 w-3 text-blue-400" />
    } else {
      return <Check className="h-3 w-3 text-slate-400" />
    }
  }

  return (
    <div className={`flex items-end space-x-2 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} alt={message.sender.user_name} />
          <AvatarFallback className="bg-slate-600 text-white text-xs">
            {message.sender.user_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      {showAvatar && isOwn && (
        <div className="w-8 flex-shrink-0"></div>
      )}

      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-slate-700 text-white rounded-bl-md'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
          
          {message.isEdited && (
            <span className="text-xs opacity-70 italic">edited</span>
          )}
        </div>
        
        {showTime && (
          <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-xs text-slate-400">{formatTime(message.sentAt)}</span>
            {getReadStatusIcon()}
          </div>
        )}
      </div>
    </div>
  )
}
