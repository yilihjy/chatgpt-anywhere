import Dexie, { type Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import type { conversation, message } from '../types/DB'

export class ChatWithGPTDatabase extends Dexie {
  conversations!: Table<conversation>
  messages!: Table<message>
  constructor() {
    super('chatWithGPTDatabase')
    this.version(1).stores({
      conversations: '&id, title, updated, *messageIds',
      messages: '&id, content, belongTo'
    })
  }
}

export const db = new ChatWithGPTDatabase()

export function useConversationRecord() {
  /**
   * 创建对话
   * @param role
   * @param content
   * @returns
   */
  async function addNewConversations(role: string, content: string) {
    const id: string = uuidv4()
    await db.conversations.add({
      id: id,
      title: '',
      messageIds: [],
      updated: new Date().getTime(),
      created: new Date().getTime(),
      finished: false
    })
    const messageId: string = uuidv4()
    await db.messages.add({
      id: messageId,
      belongTo: id,
      prompt: content,
      role: role,
      updated: new Date().getTime(),
      created: new Date().getTime()
    })
    await db.conversations
      .where('id')
      .equals(id)
      .modify((conversation: conversation) => conversation.messageIds.push(messageId))
    return id
  }

  async function addNewMessage(role: string, content: string, belongTo: string, title?: boolean) {
    const id: string = uuidv4()
    await db.messages.add({
      id: id,
      belongTo: belongTo,
      content: content,
      role: role,
      updated: new Date().getTime(),
      created: new Date().getTime()
    })
    await db.conversations
      .where('id')
      .equals(belongTo)
      .modify((conversation: conversation) => {
        conversation.messageIds.push(id);
        conversation.updated = new Date().getTime();
        if (title) {
            conversation.title = content.length > 10 ? content.slice(0, 10) : content
        }
        conversation.finished = role === 'assistant'
      })
  }

  return {
    addNewConversations,
    addNewMessage
  }
}
