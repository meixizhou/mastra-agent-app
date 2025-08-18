import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Message } from '@/types'
import { User, Bot } from 'lucide-react'
import { clsx } from 'clsx'

interface MessageComponentProps {
  message: Message
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={clsx(
      'flex gap-3 p-4 animate-slide-up',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={clsx(
        'message',
        isUser ? 'message-user' : 'message-assistant'
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ node, className, children, ...props }) {
                  return(
                    <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}
