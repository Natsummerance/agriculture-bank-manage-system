/**
 * IM 浮窗全局单例 Hook
 * 用于买家联系卖家、卖家联系买家等场景
 */

import { useState, useCallback, useEffect } from 'react';

interface ImSession {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetRole: 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';
  messages: ImMessage[];
}

interface ImMessage {
  id: string;
  fromUserId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface UseImDialogReturn {
  isOpen: boolean;
  currentSession: ImSession | null;
  openSession: (targetUserId: string, targetUserName: string, targetRole: string) => void;
  closeSession: () => void;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file') => Promise<void>;
  messages: ImMessage[];
}

let globalSession: ImSession | null = null;
let globalIsOpen = false;

export function useImDialog(): UseImDialogReturn {
  const [isOpen, setIsOpen] = useState(globalIsOpen);
  const [currentSession, setCurrentSession] = useState<ImSession | null>(globalSession);

  const openSession = useCallback(
    (targetUserId: string, targetUserName: string, targetRole: string) => {
      const session: ImSession = {
        id: `im-${Date.now()}`,
        targetUserId,
        targetUserName,
        targetRole: targetRole as any,
        messages: [],
      };

      globalSession = session;
      globalIsOpen = true;
      setCurrentSession(session);
      setIsOpen(true);
    },
    []
  );

  const closeSession = useCallback(() => {
    globalIsOpen = false;
    setIsOpen(false);
    // 延迟清除 session，保留聊天记录
    setTimeout(() => {
      if (!globalIsOpen) {
        globalSession = null;
        setCurrentSession(null);
      }
    }, 300);
  }, []);

  const sendMessage = useCallback(
    async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
      if (!currentSession) return;

      const message: ImMessage = {
        id: `msg-${Date.now()}`,
        fromUserId: 'current-user', // 实际应从上下文获取
        content,
        timestamp: new Date(),
        type,
      };

      // 更新本地状态
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, message],
      };

      globalSession = updatedSession;
      setCurrentSession(updatedSession);

      // 调用后端接口
      try {
        await fetch('/api/im/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession.id,
            targetUserId: currentSession.targetUserId,
            content,
            type,
          }),
        });
      } catch (error) {
        console.error('发送消息失败:', error);
      }
    },
    [currentSession]
  );

  return {
    isOpen,
    currentSession,
    openSession,
    closeSession,
    sendMessage,
    messages: currentSession?.messages || [],
  };
}
