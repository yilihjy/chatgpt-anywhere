import { reactive, ref } from 'vue';
import type { BCparticipants, BCMessage } from '../types/beautifulChat';

export function useBeautifulChat(onUserSendMessage: (msg: string) => void) {

    const participants = reactive<BCparticipants>([
        {
            id: 'admin',
            name: 'admin',
            imageUrl: 'https://ui-avatars.com/api/?name=%E7%AE%A1%E7%90%86'
        },
        {
            id: 'assistant',
            name: 'chatGPT',
            imageUrl: 'https://ui-avatars.com/api/?name=AI'
        }
    ]);

    const messageList = reactive<Array<BCMessage>>([]);

    const newMessagesCount = ref(0);

    const isChatOpen = ref(false);

    const beautifulChatConfig = reactive({
        participants: participants, // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
        titleImageUrl: 'https://ui-avatars.com/api/?name=AI',
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
        messageStyling: false,// enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
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
        open: openChat,
    })

    function sendMessage(text: string) {
        if (text.length > 0) {
            newMessagesCount.value = isChatOpen.value ? newMessagesCount.value : newMessagesCount.value + 1;
            onMessageWasSent({ author: 'assistant', type: 'text', data: { text }, suggestions: ['系统指令：结束本次会话'] })
        }
    }

    function sendSystemMessage(text: string) {
        if (text.length > 0) {
            newMessagesCount.value = isChatOpen.value ? newMessagesCount.value : newMessagesCount.value + 1;
            onMessageWasSent({ author: 'admin', type: 'text', data: { text } })
        }
    }

    function onMessageWasSent(message: BCMessage) {
        console.log(message, JSON.stringify(message));
        messageList.push(message);
        if (message.author === 'me') {
            if (message.type === 'text') {
                onUserSendMessage(message.data.text);
            } else if (message.type === 'emoji') {
                console.log('TODO');
            } else if (message.type === 'file') {
                console.log('TODO');
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

    return {
        beautifulChatConfig,
        sendMessage,
        sendSystemMessage
    }
    // function handleOnType() {
    //     console.log('Emit typing event')
    // }
    // function editMessage(message: BCTextMessage) {
    //     const m = messageList.find(m => m.id === message.id);
    //     if (m) {
    //         m.isEdited = true;
    //         if (m.type === 'text') {
    //             m.data.text = message.data.text;
    //         }

    //     }
    // }
}

