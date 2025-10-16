import React from 'react'
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  _id: string
  user_name: string
  email: string
  avatar?: string
  isOnline: boolean
  lastActive: string
}

interface ChatHeaderProps {
  user: User
  onBack?: () => void
}

export function ChatHeader({ user, onBack }: ChatHeaderProps) {
  const formatLastSeen = (lastActive: string) => {
    if (user.isOnline) {
      return 'Online'
    }
    
    const date = new Date(lastActive)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Active now'
    } else if (diffInHours < 24) {
      return `Active ${Math.floor(diffInHours)}h ago`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `Active ${days}d ago`
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.user_name} />
            <AvatarFallback className="bg-slate-600 text-white">
              {user.user_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-white">{user.user_name}</h3>
          <p className={`text-sm ${
            user.isOnline ? 'text-green-400' : 'text-slate-400'
          }`}>
            {formatLastSeen(user.lastActive)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <Video className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              <Info className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              <Phone className="mr-2 h-4 w-4" />
              Voice Call
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              <Video className="mr-2 h-4 w-4" />
              Video Call
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-red-400 hover:bg-slate-700">
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:bg-slate-700">
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
