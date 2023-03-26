import Api2d from 'api2d'
import type { ChatGPTMessage, ChatGptResponse } from '../types/chatGPT'
import { useConfig } from './useConfig'
export function useApi2d() {
  async function sendMessageToApi2d(
    msg: string,
    conversations: Array<ChatGPTMessage> = [],
    onMessage?: (chars: string, isStart: boolean) => void
  ) {
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

    let streamStart = true

    const ret: ChatGptResponse = await api.completion({
      model: refConfig.value.model,
      messages: messages,
      stream: refConfig.value.stream,
      max_tokens: refConfig.value.max_tokens || 1000,
      temperature: refConfig.value.temperature || 1,
      onMessage: (chars: string) => {
        if (streamStart) {
          onMessage && onMessage(chars, true)
          streamStart = false
        } else {
          onMessage && onMessage(chars, false)
        }
        console.log('onMessage', chars)
      },
      onEnd: (chars: string) => {
        console.log('onEnd', chars)
      }
    })
    console.log('ret', ret)
    try {
      if (typeof ret === 'string') {
        // 流输出
        const message: ChatGPTMessage = {
          content: ret,
          role: 'assistant'
        }
        messages.push(message)
        return {
          choices: [
            {
              message: message
            }
          ],
          conversations: messages,
          origin: ret
        }
      } else {
        return {
          choices: ret.choices,
          conversations: messages.concat(ret.choices.map((item) => item.message)),
          origin: ret
        }
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
