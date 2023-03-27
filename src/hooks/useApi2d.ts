import Api2d from 'api2d'
import { ref } from 'vue';
import type { ChatGPTMessage, ChatGptResponse } from '../types/chatGPT'
import { useConfig } from './useConfig'
import { useConversationRecord } from './useConversationRecord'
export function useApi2d() {
  const { addNewConversations, addNewMessage } = useConversationRecord();
  const conversationId = ref<string>('');
  async function sendMessageToApi2d(
    msg: string,
    conversations: Array<ChatGPTMessage> = [],
    onMessage: (chars: string) => void
  ) {
   

    try {
      const { refConfig } = useConfig()

      const messages: Array<ChatGPTMessage> = []
      if (conversations.length > 0) {
        // 有历史对话
        messages.splice(messages.length, 0, ...conversations)
        await addNewMessage('user', msg, conversationId.value, false);
      } else {
        // 没有历史对话
        messages.push({
          role: 'system',
          content: refConfig.value.systemRole
        })
        conversationId.value = await addNewConversations('system', refConfig.value.systemRole)
        await addNewMessage('user', msg, conversationId.value, true);
      }
      messages.push({
        role: 'user',
        content: msg
      })
      
      if (!refConfig.value.key) {
        throw new Error('系统错误：请先设置key')
      }
      const api = new Api2d(refConfig.value.key, refConfig.value.baseUrl)
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
      // TODO 保存chatGPT回复
      try {
        if (refConfig.value.stream) {
          await addNewMessage('assistant', ret as string, conversationId.value);
          const message: ChatGPTMessage = {
            content: ret as string,
            role: 'assistant'
          }
          messages.push(message)
          return {
            conversations: messages
          }
        } else {
          const messageText = (ret as ChatGptResponse).choices[0].message.content
          onMessage(messageText)
          await addNewMessage('assistant', messageText, conversationId.value);
          return {
            conversations: messages.concat(
              (ret as ChatGptResponse).choices.map((item) => item.message)
            ),
            origin: ret
          }
        }
      } catch (error) {
        console.log(error);
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
