import { useState } from 'react'
import { SignUp } from './components/auth/SignUp'
import { Login } from './components/auth/Login'
import { OTPVerification } from './components/auth/OTPVerification'
import { ChatLayout } from './components/chat/ChatLayout'

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

type AuthStep = 'login' | 'signup' | 'otp' | 'chat'

function App() {
  const [authStep, setAuthStep] = useState<AuthStep>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data - in real app, this would come from API/state management
  const mockUsers: User[] = [
    {
      _id: 'user1',
      user_name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastActive: new Date().toISOString(),
    },
    {
      _id: 'user2',
      user_name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastActive: new Date().toISOString(),
    },
    {
      _id: 'user3',
      user_name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: 'user4',
      user_name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastActive: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      _id: 'user5',
      user_name: 'Mike Chen',
      email: 'mike@example.com',
      isOnline: false,
      lastActive: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  const mockConversations: Conversation[] = [
    {
      _id: 'conv1',
      participants: [
        currentUser || {
          _id: 'currentUser',
          user_name: 'Current User',
          email: 'current@example.com',
          isOnline: true,
          lastActive: new Date().toISOString(),
        },
        mockUsers[1], // Alice
      ],
      lastMessage: {
        _id: 'msg1',
        content: 'Sure! I can share the repository with you once it\'s ready.',
        sender: currentUser || {
          _id: 'currentUser',
          user_name: 'Current User',
          email: 'current@example.com',
          isOnline: true,
          lastActive: new Date().toISOString(),
        },
        sentAt: new Date(Date.now() - 1000000).toISOString(),
      },
      updatedAt: new Date(Date.now() - 1000000).toISOString(),
    },
    {
      _id: 'conv2',
      participants: [
        currentUser || {
          _id: 'currentUser',
          user_name: 'Current User',
          email: 'current@example.com',
          isOnline: true,
          lastActive: new Date().toISOString(),
        },
        mockUsers[2], // Bob
      ],
      lastMessage: {
        _id: 'msg2',
        content: 'Thanks for the help with the project!',
        sender: mockUsers[2],
        sentAt: new Date(Date.now() - 3600000).toISOString(),
      },
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  const handleSignUp = async (data: { userName: string; email: string; password: string }) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPendingEmail(data.email)
    setAuthStep('otp')
    setLoading(false)
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    setCurrentUser({
      _id: 'currentUser',
      user_name: 'Current User',
      email: data.email,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastActive: new Date().toISOString(),
    })
    setAuthStep('chat')
    setLoading(false)
  }

  const handleVerifyOTP = async (_otp: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful verification
    setCurrentUser({
      _id: 'currentUser',
      user_name: 'New User',
      email: pendingEmail,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      lastActive: new Date().toISOString(),
    })
    setAuthStep('chat')
    setLoading(false)
  }

  const handleResendOTP = async () => {
    // Simulate API call
    console.log('Resending OTP...')
  }

  const handleSendMessage = (conversationId: string, content: string) => {
    // Simulate sending message
    console.log('Sending message:', { conversationId, content })
  }

  const handleStartConversation = (userId: string) => {
    // Simulate starting conversation
    console.log('Starting conversation with user:', userId)
  }

  const handleSearchUsers = (query: string): User[] => {
    if (!query) return mockUsers.filter(user => user._id !== currentUser?._id)
    
    return mockUsers.filter(user => 
      user._id !== currentUser?._id &&
      (user.user_name.toLowerCase().includes(query.toLowerCase()) ||
       user.email.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Render auth screens
  if (authStep === 'signup') {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToLogin={() => setAuthStep('login')}
        loading={loading}
      />
    )
  }

  if (authStep === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignUp={() => setAuthStep('signup')}
        loading={loading}
      />
    )
  }

  if (authStep === 'otp') {
    return (
      <OTPVerification
        email={pendingEmail}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        loading={loading}
      />
    )
  }

  // Render chat app
  if (authStep === 'chat' && currentUser) {
    return (
      <ChatLayout
        currentUser={currentUser}
        conversations={mockConversations}
        onSendMessage={handleSendMessage}
        onStartConversation={handleStartConversation}
        onSearchUsers={handleSearchUsers}
      />
    )
  }

  return null
}

export default App