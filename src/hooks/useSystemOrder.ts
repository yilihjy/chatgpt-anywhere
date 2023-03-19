
const END_CONVERSATIONS = '结束本次会话';

const SAVE_LAST_CONVERSATIONS = '保存最近一次会话';

const UPLOAD_CONVERSATIONS = '上传对话';

const ORDER_LIST = [END_CONVERSATIONS, SAVE_LAST_CONVERSATIONS, UPLOAD_CONVERSATIONS]

export const ORDER_LIST_COMPLETE = ORDER_LIST.map(item => `系统指令：${item}`);

export function useSystemOrder() {
    const systemOrderReg = /^系统指令：/;

    const orderHandel = new Map<string, (...args: any[]) => void>();

    function isSystemOrder (msg: string) {
        return systemOrderReg.test(msg)
    }

    function setOrderHandle (order: string, handle: (...args: any[]) => void) {
        orderHandel.set(order, handle)
    }

    function executeOrder(order:string, ...args: any[]) {
        const handle = orderHandel.get(order.replace(systemOrderReg, ''));
        if (handle) {
            handle(args)
        } else {
            console.warn('没有找到处理命令的函数')
        }
       
    }

    return {
        ORDER_LIST_COMPLETE,
        isSystemOrder,
        setOrderHandle,
        executeOrder,
        END_CONVERSATIONS,
        SAVE_LAST_CONVERSATIONS,
        UPLOAD_CONVERSATIONS
    }

}