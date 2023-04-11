import { reactive, onMounted } from 'vue'
import type { ChatGPTMessage } from '../types/chatGPT'
import { useBeautifulChat } from '../hooks/useBeautifulChat'
import { useApi2d } from '../hooks/useApi2d'
import { useConversationRecord } from '../hooks/useConversationRecord'
import { useSystemOrder } from './useSystemOrder'
import { klona } from 'klona/json'

export function useMessageManage() {
  const { beautifulChatConfig, sendMessage, sendSystemMessage, setAllMessage, replaceLastMessage } =
    useBeautifulChat(onUserSendMessage)
  const { sendMessageToApi2d, setConversationId } = useApi2d()
  const {
    isSystemOrder,
    setOrderHandle,
    executeOrder,
    END_CONVERSATIONS,
    SAVE_LAST_CONVERSATIONS,
    UPLOAD_CONVERSATIONS
  } = useSystemOrder()

  const { toUIdata, addNewConversations, addNewMessage } = useConversationRecord()

  const currentConversations = reactive<{
    conversations: Array<ChatGPTMessage>
  }>({
    conversations: []
  })

  const oldConversations = reactive<{
    conversations: Array<ChatGPTMessage>
  }>({
    conversations: []
  })

  setOrderHandle(END_CONVERSATIONS, () => {
    if (currentConversations.conversations.length === 0) {
      sendSystemMessage('当前没有进行中的会话')
    } else {
      oldConversations.conversations = klona(currentConversations.conversations)
      currentConversations.conversations = []
      sendSystemMessage('本次会话已结束，新发送的消息将开始一次全新的会话')
    }
  })

  setOrderHandle(SAVE_LAST_CONVERSATIONS, () => {
    let conversations: Array<ChatGPTMessage> = []
    if (currentConversations.conversations.length > 0) {
      conversations = klona(currentConversations.conversations)
    } else if (oldConversations.conversations.length > 0) {
      conversations = klona(oldConversations.conversations)
    } else {
      sendSystemMessage('抱歉没有找到最近一次的对话')
      return
    }
    const blob = new Blob([JSON.stringify(conversations, undefined, 4)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const key = `chatgpt-anywhere-conversations${new Date().toString()}.json`
    a.download = key
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    sendSystemMessage(`文件已保存，文件名为${key}`)
  })

  setOrderHandle(UPLOAD_CONVERSATIONS, () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', () => {
      if (input && input.files && input.files[0]) {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = function (event) {
          if (event.target && event.target.result) {
            const contents = event.target.result
            if (typeof contents === 'string') {
              const data = JSON.parse(contents)
              console.log('upload data', data)
              if (Array.isArray(data)) {
                showChatByData(data)
                document.body.removeChild(input)
              } else {
                document.body.removeChild(input)
              }
            } else {
              document.body.removeChild(input)
            }
          } else {
            document.body.removeChild(input)
          }
        }
        reader.readAsText(file)
      }
    })
    document.body.appendChild(input)
    input.click()
  })

  async function onUserSendMessage(msg: string) {
    if (isSystemOrder(msg)) {
      executeOrder(msg)
    } else {
      try {
        sendMessage('回答生成中，请稍等片刻')
        const { conversations } = await sendMessageToApi2d(
          msg,
          klona(currentConversations.conversations),
          (chars) => {
            replaceLastMessage(chars)
          }
        )
        currentConversations.conversations = conversations
      } catch (error) {
        const errReg = /^系统错误：/
        if (error instanceof Error) {
          if (errReg.test(error.message)) {
            sendSystemMessage(error.message.replace(errReg, ''))
          } else {
            sendSystemMessage(error.message)
          }
        }
      }
    }
  }

  async function showChatByData(data: Array<ChatGPTMessage>) {
    currentConversations.conversations = data
    setAllMessage(klona(currentConversations.conversations))
    const sys = data[0]
    const id = await addNewConversations(sys.role, sys.content)
    let noTitle = true
    for (const item of data.slice(1)) {
      if (noTitle) {
        await addNewMessage(item.role, item.content, id, noTitle)
        noTitle = false
      } else {
        await addNewMessage(item.role, item.content, id)
      }
    }
    setConversationId(id)
  }

  async function showChatById(id: string) {
    const data = await toUIdata(id)
    currentConversations.conversations = data
    setAllMessage(klona(currentConversations.conversations))
    setConversationId(id)
  }

  onMounted(() => {
    sendSystemMessage('你现在可以和chatGPT聊天了')
  })

  return {
    beautifulChatConfig,
    sendSystemMessage,
    showChatById
  }
}
