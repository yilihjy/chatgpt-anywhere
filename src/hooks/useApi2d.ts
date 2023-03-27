import Api2d from 'api2d'
import type { ChatGPTMessage, ChatGptResponse } from '../types/chatGPT'
import { useConfig } from './useConfig'
export function useApi2d() {
  async function sendMessageToApi2d(
    msg: string,
    conversations: Array<ChatGPTMessage> = [],
    onMessage: (chars: string) => void
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

    try {
      const ret: ChatGptResponse | string = await api.completion({
        model: refConfig.value.model,
        messages: messages,
        stream: refConfig.value.stream,
        max_tokens: refConfig.value.max_tokens || 1000,
        temperature: refConfig.value.temperature || 1,
        onMessage: (chars: string) => {
          console.log('onMessage', chars)
          onMessage(chars)
        },
        onEnd: (chars: string) => {
          console.log('onEnd', chars)
        }
      })
      console.log('ret', ret)
      try {
        if (refConfig.value.stream) {
          const message: ChatGPTMessage = {
            content: ret as string,
            role: 'assistant'
          }
          messages.push(message)
          return {
            conversations: messages
          }
        } else {
          onMessage((ret as ChatGptResponse).choices[0].message.content)
          return {
            conversations: messages.concat(
              (ret as ChatGptResponse).choices.map((item) => item.message)
            ),
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
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        throw new Error(`发生错误-${error.message}`)
      } else {
        throw error
      }
    }
  }

  return {
    sendMessageToApi2d
  }
}
