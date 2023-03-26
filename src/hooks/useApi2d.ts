import Api2d from 'api2d'
import type { ChatGPTMessage, ChatGptResponse } from '../types/chatGPT'
import { useConfig } from './useConfig'
export function useApi2d() {
  async function sendMessageToApi2d(msg: string, conversations: Array<ChatGPTMessage> = []) {
    const { refConfig } = useConfig()

    const messages: Array<ChatGPTMessage> = []
    if (conversations.length > 0) {
      // 有历史对话
      messages.splice(messages.length, 0, ...conversations)
    } else {
      // 没有历史对话
      messages.push({
        role: 'system',
        content: refConfig.value.systemRole
      })
    }
    messages.push({
      role: 'user',
      content: msg
    })
    if (!refConfig.value.key) {
      throw new Error('系统错误：请先设置key')
    }
    const api = new Api2d(refConfig.value.key, refConfig.value.baseUrl)

    const ret: ChatGptResponse = await api.completion({
      model: refConfig.value.model,
      messages: messages,
      stream: false,
      max_tokens: refConfig.value.max_tokens || 1000,
      temperature: refConfig.value.temperature || 1
    })
    try {
      return {
        choices: ret.choices,
        conversations: messages.concat(ret.choices.map((item) => item.message)),
        origin: ret
      }
    } catch (error) {
      if (ret) {
        throw new Error(
          `发生错误，错误原因:\n\`\`\`json\n${JSON.stringify(ret, undefined, 4)}\n\`\`\``
        )
      } else {
        throw error
      }
    }
  }

  return {
    sendMessageToApi2d
  }
}
