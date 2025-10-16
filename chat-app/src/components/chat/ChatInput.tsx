import React, { useState, useRef, KeyboardEvent } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const handleFileUpload = () => {
    // File upload functionality would go here
    console.log('File upload clicked')
  }

  const handleEmoji = () => {
    // Emoji picker functionality would go here
    console.log('Emoji picker clicked')
  }

  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileUpload}
          className="text-slate-400 hover:text-white hover:bg-slate-700 flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 pr-12"
            rows={1}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEmoji}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white hover:bg-slate-700 p-1"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-slate-400">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  )
}
