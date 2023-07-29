import Dexie, { type Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import type { conversation, message, PaginationResult } from '../types/DB'
import type { ChatGPTMessage } from '@/types/chatGPT'

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
        conversation.messageIds.push(id)
        conversation.updated = new Date().getTime()
        if (title) {
          const TITLE_MAX_LENGTH = 25
          conversation.title =
            content.length > TITLE_MAX_LENGTH ? content.slice(0, TITLE_MAX_LENGTH) : content
        }
        conversation.finished = role === 'assistant'
      })
  }

  async function getConversationsByPage(
    page: number,
    pageSize = 10,
    order: 'asc' | 'desc' = 'desc'
  ): Promise<PaginationResult<conversation>> {
    const totalItems = await db.conversations.count()
    const totalPages = Math.ceil(totalItems / pageSize)
    const offset = (page - 1) * pageSize
    let conversations: Array<conversation>
    if (order === 'desc') {
      conversations = await db.conversations
        .orderBy('updated')
        .reverse()
        .offset(offset)
        .limit(pageSize)
        .toArray()

      return {
        list: conversations,
        currentPage: page,
        totalPages,
        totalItems
      }
    } else {
      conversations = await db.conversations
        .orderBy('updated')
        .offset(offset)
        .limit(pageSize)
        .toArray()
    }
    return {
      list: conversations,
      currentPage: page,
      totalPages,
      totalItems
    }
  }

  async function getMessagesByBelongTo(belongTo: string): Promise<message[]> {
    const messages = await db.messages.where('belongTo').equals(belongTo).sortBy('created')
    return messages
  }

  async function toUIdata(belongTo: string): Promise<Array<ChatGPTMessage>> {
    const list = await getMessagesByBelongTo(belongTo)
    console.log(list)
    return list.map((item) => {
      return {
        role: item.role as 'system' | 'assistant' | 'user',
        content: item.content || item.prompt || ''
      }
    })
  }

  return {
    addNewConversations,
    addNewMessage,
    getConversationsByPage,
    getMessagesByBelongTo,
    toUIdata
  }
}
