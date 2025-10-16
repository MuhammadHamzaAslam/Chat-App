import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface User {
  _id: string
  user_name: string
  email: string
  avatar?: string
  isOnline: boolean
  lastActive: string
}

interface SearchPeopleProps {
  users: User[]
  onUserSelect: (user: User) => void
  onClose: () => void
  onSearch: (query: string) => User[]
}

export function SearchPeople({ users, onUserSelect, onClose, onSearch }: SearchPeopleProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)

  useEffect(() => {
    const results = onSearch(searchQuery)
    setFilteredUsers(results)
  }, [searchQuery, onSearch])

  const formatLastSeen = (lastActive: string) => {
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
    <div className="flex flex-col h-full bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-white">New Chat</h2>
            <p className="text-sm text-slate-400">Find people to start a conversation</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                {searchQuery ? 'No users found' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => onUserSelect(user)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors group"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.user_name} />
                      <AvatarFallback className="bg-slate-600 text-white">
                        {user.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                        {user.user_name}
                      </h4>
                      <span className={`text-xs flex-shrink-0 ml-2 ${
                        user.isOnline ? 'text-green-400' : 'text-slate-400'
                      }`}>
                        {user.isOnline ? 'Online' : formatLastSeen(user.lastActive)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
