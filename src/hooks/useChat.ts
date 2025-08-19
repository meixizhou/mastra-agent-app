import { useState, useCallback } from 'react'
import { MastraClient } from '@mastra/client-js'
import { Message } from '@/types'

export const mastraClient = new MastraClient({
  baseUrl: import.meta.env.VITE_API_URL || 'xxx'
})
const weatherAgent = await mastraClient.getAgent('weatherAgent')

// 生成当前的threadId，memory用的
let mastraRandomID = localStorage.getItem('mwacId') || ''
if (!mastraRandomID) {
  const tid = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  mastraRandomID = tid
  localStorage.setItem('mwacId', tid)
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // 本地变量累积流式内容
    let streamedContent = ''
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    }
    setIsLoading(true)

    try {
      const stream = await weatherAgent.stream({
        messages: [userMessage],
        threadId: `thread_${mastraRandomID}`,
        resourceId: `user_${mastraRandomID}`
      })

       await stream.processDataStream({
        onTextPart: (text: string) => {
          streamedContent += text
        },
        onFinishMessagePart() {
          setIsLoading(false)
          // 使用累积的完整内容创建最终消息
          const finalMessage: Message = {
            ...assistantMessage,
            content: streamedContent
          }
          setMessages(prev => [...prev, finalMessage])
        },
        onErrorPart(error: any) {
          setIsLoading(false)
          const errorMessage: Message = {
            id: `error_${Date.now()}`,
            content: error || 'Unable to connect to Mastra agent',
            role: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
        }
      })
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content:'Unable to connect to Mastra agent',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  }
}