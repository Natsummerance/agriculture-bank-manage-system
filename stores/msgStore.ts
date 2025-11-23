import { create } from 'zustand';
import { toast } from 'sonner';

export interface Message {
  id: string;
  type: 'system' | 'order' | 'im' | 'finance';
  title: string;
  content: string;
  time: string;
  read: boolean;
  link?: string;
}

interface MsgState {
  messages: Message[];
  unread: number;
  
  // Actions
  addMessage: (message: Omit<Message, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  deleteMessage: (id: string) => void;
  clearAll: () => void;
}

export const useMsgStore = create<MsgState>((set, get) => ({
  messages: [
    {
      id: '1',
      type: 'order',
      title: '订单已发货',
      content: '您购买的有机富硒苹果已发货，预计2天后送达',
      time: '5分钟前',
      read: false,
      link: '/order/detail/123',
    },
    {
      id: '2',
      type: 'im',
      title: '专家回复了您',
      content: '农业专家张老师：建议您在春季播种，注意土壤湿度...',
      time: '1小时前',
      read: false,
      link: '/consult/456',
    },
    {
      id: '3',
      type: 'finance',
      title: '贷款审批通过',
      content: '您申请的10万元农业贷款已审批通过，请及时签署合同',
      time: '3小时前',
      read: true,
      link: '/finance/contract/789',
    },
  ],
  unread: 2,

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const messages = [newMessage, ...get().messages];
    set({
      messages,
      unread: messages.filter(m => !m.read).length,
    });
    
    // 显示通知
    toast(message.title, {
      description: message.content,
      duration: 3000,
    });
  },

  markAsRead: (id) => {
    const messages = get().messages.map(msg =>
      msg.id === id ? { ...msg, read: true } : msg
    );
    set({
      messages,
      unread: messages.filter(m => !m.read).length,
    });
  },

  markAllRead: () => {
    const messages = get().messages.map(msg => ({ ...msg, read: true }));
    set({
      messages,
      unread: 0,
    });
    toast.success('已全部标记为已读');
  },

  deleteMessage: (id) => {
    const messages = get().messages.filter(msg => msg.id !== id);
    set({
      messages,
      unread: messages.filter(m => !m.read).length,
    });
    toast.success('消息已删除');
  },

  clearAll: () => {
    set({
      messages: [],
      unread: 0,
    });
    toast.success('已清空所有消息');
  },
}));
