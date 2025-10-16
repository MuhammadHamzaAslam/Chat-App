import React, { useState } from 'react'
import { Search, Users, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatListItem } from './ChatListItem'

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

interface ChatSidebarProps {
  currentUser: User
  conversations: Conversation[]
  onConversationSelect: (conversation: Conversation) => void
  onStartNewChat: () => void
}

export function ChatSidebar({ 
  currentUser, 
  conversations, 
  onConversationSelect, 
  onStartNewChat 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true
    
    const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id)
    return otherParticipant?.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conversation.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  })

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

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.user_name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {currentUser.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{currentUser.user_name}</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onStartNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Users className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={onStartNewChat}
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 mt-2"
                >
                  Start your first chat
                </Button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ChatListItem
                key={conversation._id}
                conversation={conversation}
                currentUser={currentUser}
                onClick={() => onConversationSelect(conversation)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
