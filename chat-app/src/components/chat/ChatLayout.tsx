import React, { useState } from 'react'
import { ChatSidebar } from './ChatSidebar'
import { ChatArea } from './ChatArea'
import { SearchPeople } from './SearchPeople'

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

interface ChatLayoutProps {
  currentUser: User
  conversations: Conversation[]
  onSendMessage: (conversationId: string, content: string) => void
  onStartConversation: (userId: string) => void
  onSearchUsers: (query: string) => User[]
}

export function ChatLayout({ 
  currentUser, 
  conversations, 
  onSendMessage, 
  onStartConversation,
  onSearchUsers 
}: ChatLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showSearchPeople, setShowSearchPeople] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    if (isMobile) {
      // On mobile, hide sidebar when conversation is selected
      setShowSearchPeople(false)
    }
  }

  const handleBackToSidebar = () => {
    setSelectedConversation(null)
  }

  const handleStartNewChat = () => {
    setShowSearchPeople(true)
  }

  const handleUserSelect = (user: User) => {
    onStartConversation(user._id)
    setShowSearchPeople(false)
    // Find or create conversation with this user
    const existingConversation = conversations.find(conv => 
      conv.participants.some(p => p._id === user._id)
    )
    if (existingConversation) {
      setSelectedConversation(existingConversation)
    }
  }

  const handleCloseSearch = () => {
    setShowSearchPeople(false)
  }

  // Mobile layout
  if (isMobile) {
    if (showSearchPeople) {
      return (
        <SearchPeople
          users={onSearchUsers('')}
          onUserSelect={handleUserSelect}
          onClose={handleCloseSearch}
          onSearch={onSearchUsers}
        />
      )
    }

    if (selectedConversation) {
      return (
        <ChatArea
          currentUser={currentUser}
          conversation={selectedConversation}
          onSendMessage={onSendMessage}
          onBack={handleBackToSidebar}
        />
      )
    }

    return (
      <ChatSidebar
        currentUser={currentUser}
        conversations={conversations}
        onConversationSelect={handleConversationSelect}
        onStartNewChat={handleStartNewChat}
      />
    )
  }

  // Desktop layout
  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700">
        {showSearchPeople ? (
          <SearchPeople
            users={onSearchUsers('')}
            onUserSelect={handleUserSelect}
            onClose={handleCloseSearch}
            onSearch={onSearchUsers}
          />
        ) : (
          <ChatSidebar
            currentUser={currentUser}
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            onStartNewChat={handleStartNewChat}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatArea
            currentUser={currentUser}
            conversation={selectedConversation}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-900">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome to ChatApp
              </h2>
              <p className="text-slate-400 mb-6">
                Select a conversation to start chatting
              </p>
              <button
                onClick={handleStartNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
