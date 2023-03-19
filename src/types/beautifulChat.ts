export interface BCparticipant {
    id: string;
    name: string;
    imageUrl: string;
}

export type BCparticipants = Array<BCparticipant>;

export interface BCBaseMessage {
    author: string;
    type: 'text' | 'emoji' | 'file';
    id?:  number | string;
    isEdited?: boolean;
    suggestions?: Array<string>;
}

export interface BCTextMessageData {
    text: string;
    meta?: string;
}


export interface BCTextMessage extends  BCBaseMessage{
    type: 'text';
    data: BCTextMessageData
}

export interface BCEmojiMessageData {
    code: string
}

export interface BCEmojiMessage extends  BCBaseMessage{
    type: 'emoji';
    data: BCEmojiMessageData
}

export interface BCFileMessageData {
    file: {
        name: string;
        url: string;
    }
}

export interface BCFileMessage extends  BCBaseMessage{
    type: 'file';
    data: BCFileMessageData
}

export type BCMessage = BCTextMessage | BCEmojiMessage | BCFileMessage;