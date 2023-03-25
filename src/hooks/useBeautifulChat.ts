import { reactive, ref } from 'vue'
import type { BCparticipants, BCMessage, BCTextMessage } from '../types/beautifulChat'
import { ORDER_LIST_COMPLETE } from './useSystemOrder'
import type { ChatGPTMessage } from '../types/chatGPT'

import AIAvatar from '../assets/images/ai-avatar.png'
export function useBeautifulChat(onUserSendMessage: (msg: string) => void) {
  const participants = reactive<BCparticipants>([
    {
      id: 'admin',
      name: 'admin',
      imageUrl: 'https://ui-avatars.com/api/?name=%E7%B3%BB%E7%BB%9F'
    },
    {
      id: 'assistant',
      name: 'chatGPT',
      imageUrl: AIAvatar
    }
  ])

  const messageList = reactive<Array<BCMessage>>([])

  const newMessagesCount = ref(0)

  const isChatOpen = ref(false)

  const beautifulChatConfig = reactive({
    participants: participants, // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
    titleImageUrl: AIAvatar,
    messageList: messageList, // the list of the messages to show, can be paginated and adjusted dynamically
    newMessagesCount: newMessagesCount,
    isOpen: isChatOpen, // to determine whether the chat window should be open or closed
    showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
    colors: {
      header: {
        bg: '#4e8cff',
        text: '#ffffff'
      },
      launcher: {
        bg: '#4e8cff'
      },
      messageList: {
        bg: '#ffffff'
      },
      sentMessage: {
        bg: '#4e8cff',
        text: '#ffffff'
      },
      receivedMessage: {
        bg: '#eaeaea',
        text: '#222222'
      },
      userInput: {
        bg: '#f4f7f9',
        text: '#565867'
      }
    }, // specifies the color scheme for the component
    alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
    messageStyling: false, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    showEmoji: false,
    showFile: false,
    showEdition: true,
    showDeletion: true,
    deletionConfirmation: true,
    showLauncher: true,
    showCloseButton: true,
    disableUserListToggle: true,
    onMessageWasSent: onMessageWasSent,
    close: closeChat,
    open: openChat
  })

  function sendMessage(text: string) {
    if (text.length > 0) {
      newMessagesCount.value = isChatOpen.value
        ? newMessagesCount.value
        : newMessagesCount.value + 1
      onMessageWasSent({
        author: 'assistant',
        type: 'text',
        data: { text },
        suggestions: ORDER_LIST_COMPLETE
      })
    }
  }

  function sendSystemMessage(text: string, suggestions: Array<string> = ORDER_LIST_COMPLETE) {
    if (text.length > 0) {
      newMessagesCount.value = isChatOpen.value
        ? newMessagesCount.value
        : newMessagesCount.value + 1
      onMessageWasSent({ author: 'admin', type: 'text', data: { text }, suggestions })
    }
  }

  function onMessageWasSent(message: BCMessage) {
    console.log(message, JSON.stringify(message))
    messageList.push(message)
    if (message.author === 'me') {
      if (message.type === 'text') {
        onUserSendMessage(message.data.text)
      } else if (message.type === 'emoji') {
        console.log('TODO')
      } else if (message.type === 'file') {
        console.log('TODO')
      }
    }
  }

  function openChat() {
    isChatOpen.value = true
    newMessagesCount.value = 0
  }
  function closeChat() {
    isChatOpen.value = false
  }

  function setAllMessage(list: Array<ChatGPTMessage>) {
    console.log('setAllMessage', list)
    beautifulChatConfig.messageList.splice(0, beautifulChatConfig.messageList.length)
    list
      .filter((item) => item.role === 'user' || item.role === 'assistant')
      .map((item) => {
        if (item.role === 'user') {
          return {
            author: 'me',
            type: 'text',
            data: { text: item.content },
            suggestions: ORDER_LIST_COMPLETE
          }
        } else {
          return {
            author: 'assistant',
            type: 'text',
            data: { text: item.content },
            suggestions: ORDER_LIST_COMPLETE
          }
        }
      })
      .forEach((item) => {
        beautifulChatConfig.messageList.push(item as BCTextMessage)
      })
  }

  return {
    beautifulChatConfig,
    sendMessage,
    sendSystemMessage,
    setAllMessage
  }
}
