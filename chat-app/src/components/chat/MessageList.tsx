import React, { useEffect, useRef } from 'react'
import { CheckCheck, Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'

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

interface MessageListProps {
  currentUser: User
  conversationId: string
}

export function MessageList({ currentUser, conversationId }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock messages - in real app, these would come from props or API
  const mockMessages: Message[] = [
    {
      _id: '1',
      content: 'Hey! How are you doing today?',
      sender: {
        _id: 'user2',
        user_name: 'Alice Johnson',
        email: 'alice@example.com',
        isOnline: true,
        lastActive: new Date().toISOString(),
      },
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      readBy: [],
      isEdited: false,
    },
    {
      _id: '2',
      content: 'I\'m doing great! Just working on some new projects. How about you?',
      sender: currentUser,
      sentAt: new Date(Date.now() - 3500000).toISOString(),
      readBy: ['user2'],
      isEdited: false,
    },
    {
      _id: '3',
      content: 'That sounds exciting! I\'ve been learning some new technologies myself.',
      sender: {
        _id: 'user2',
        user_name: 'Alice Johnson',
        email: 'alice@example.com',
        isOnline: true,
        lastActive: new Date().toISOString(),
      },
      sentAt: new Date(Date.now() - 3400000).toISOString(),
      readBy: [],
      isEdited: false,
    },
    {
      _id: '4',
      content: 'What kind of technologies are you learning?',
      sender: currentUser,
      sentAt: new Date(Date.now() - 3300000).toISOString(),
      readBy: ['user2'],
      isEdited: false,
    },
    {
      _id: '5',
      content: 'I\'ve been diving deep into React and Node.js. The ecosystem is amazing!',
      sender: {
        _id: 'user2',
        user_name: 'Alice Johnson',
        email: 'alice@example.com',
        isOnline: true,
        lastActive: new Date().toISOString(),
      },
      sentAt: new Date(Date.now() - 3200000).toISOString(),
      readBy: [],
      isEdited: false,
    },
    {
      _id: '6',
      content: 'That\'s awesome! I\'m actually working on a chat application right now using the same stack.',
      sender: currentUser,
      sentAt: new Date(Date.now() - 3000000).toISOString(),
      readBy: ['user2'],
      isEdited: false,
    },
    {
      _id: '7',
      content: 'No way! That\'s such a coincidence. I\'d love to see what you\'re building!',
      sender: {
        _id: 'user2',
        user_name: 'Alice Johnson',
        email: 'alice@example.com',
        isOnline: true,
        lastActive: new Date().toISOString(),
      },
      sentAt: new Date(Date.now() - 2900000).toISOString(),
      readBy: [],
      isEdited: false,
    },
    {
      _id: '8',
      content: 'Sure! I can share the repository with you once it\'s ready. It\'s been a fun project so far.',
      sender: currentUser,
      sentAt: new Date(Date.now() - 1000000).toISOString(),
      readBy: ['user2'],
      isEdited: false,
    },
  ]

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [mockMessages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.sentAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
    }
  }

  const messageGroups = groupMessagesByDate(mockMessages)

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="py-4 space-y-4">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
                {formatDateHeader(date)}
              </span>
            </div>
            <div className="space-y-2">
              {messages.map((message, index) => {
                const isLastInGroup = index === messages.length - 1 || 
                  messages[index + 1].sender._id !== message.sender._id
                
                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender._id === currentUser._id}
                    showAvatar={isLastInGroup}
                    showTime={isLastInGroup}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
