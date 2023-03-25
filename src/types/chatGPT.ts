export interface ChatGPTMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
  name?: string
}

export interface ChatGptResponseUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface ChatGptResponseChoices {
  message: ChatGPTMessage
  finish_reason: 'stop' | 'length' | 'content_filter' | 'null'
  index: number
}

export interface ChatGptResponse {
  id: string
  object: string
  created: number
  model: string
  usage: ChatGptResponseUsage
  choices: Array<ChatGptResponseChoices>
  error?: any
}
