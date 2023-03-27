export interface conversation {
    /**
     * 对话的id
     */
    id: string;
    /**
     * 对话的标题
     */
    title: string;
    /**
     * 对话的内容
     */
    messageIds: Array<string>;
    /**
     * 创建时间
     */
    created: number;
    /**
     * 更新时间
     */
    updated: number;
    /**
     * 对话是否结束
     * 以chatGPT回应为标志
     */
    finished: boolean;
}

export interface message {
    /**
     * 消息id
     */
    id: string;
    /**
     * 属于哪个对话
     */
    belongTo: string;
    /**
     * 内容
     */
    content?: string;
    prompt?: string;
    /**
     * 角色
     */
    role: string;
    /**
     * 创建时间
     */
    created: number;
    /**
     * 更新时间
     */
    updated: number;
}