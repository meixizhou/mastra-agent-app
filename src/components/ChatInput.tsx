import React, { useState, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false
}) => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your location... (Press Enter to send, Shift+Enter for new line)"
          className="chat-input flex-1 min-h-[50px] max-h-32"
          disabled={disabled || isLoading}
          rows={1}
          style={{
            resize: 'none',
            height: 'auto',
            minHeight: '50px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 128) + 'px'
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading || disabled}
          className={clsx(
            'btn-primary flex items-center gap-2 px-4 py-2 h-[50px]',
            (!message.trim() || isLoading || disabled) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send
        </button>
      </div>
    </div>
  )
}
