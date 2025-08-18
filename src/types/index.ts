export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatResponse {
  message: string
  id: string
}

export interface SendMessageInput {
  message: string
  conversationId?: string
}
