import { reactive } from 'vue';
import type { ChatGPTMessage } from '../types/chatGPT';
import { useBeautifulChat } from '../hooks/useBeautifulChat';
import { useApi2d } from '../hooks/useApi2d';
import { klona } from 'klona/json';

export function useMessageManage() {
    const { beautifulChatConfig, sendMessage, sendSystemMessage } = useBeautifulChat(onUserSendMessage);
    const { sendMessageToApi2d } = useApi2d();
    const currentConversations = reactive<{
        conversations: Array<ChatGPTMessage>
    }>({
        conversations: []
    });

    async function onUserSendMessage(msg: string) {
        const systemOrderReg = /^系统指令：/;
        if (systemOrderReg.test(msg)) {
            // 执行系统指令
            console.log(msg);
            switch (msg.replace(systemOrderReg, '')) {
                case '结束本次会话':
                    currentConversations.conversations = [];
                    sendSystemMessage('本次会话已结束，新发送的消息将开始一次全新的会话')
                    break;
            }
        } else {
            try {
                const { choices, conversations } = await sendMessageToApi2d(msg, klona(currentConversations.conversations));
                currentConversations.conversations = conversations;
                choices.forEach(item => {
                    sendMessage(item.message.content)
                });
            } catch (error) {
                const errReg = /^系统错误：/;
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

    return {
        beautifulChatConfig
    }
}