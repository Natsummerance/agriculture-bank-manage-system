/**
 * 异步按钮 Hook - 防抖 + 加载态管理
 * 适用于所有提交类按钮
 */

import { useState, useCallback } from 'react';

interface UseAsyncButtonOptions {
  debounceMs?: number; // 防抖延迟（毫秒）
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAsyncButtonReturn<T = any> {
  isLoading: boolean;
  error: Error | null;
  execute: (asyncFn: () => Promise<T>) => Promise<T | undefined>;
  reset: () => void;
}

export function useAsyncButton<T = any>(
  options: UseAsyncButtonOptions = {}
): UseAsyncButtonReturn<T> {
  const { debounceMs = 300, onSuccess, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastExecuteTime, setLastExecuteTime] = useState(0);

  const execute = useCallback(
    async (asyncFn: () => Promise<T>): Promise<T | undefined> => {
      // 防抖检查
      const now = Date.now();
      if (now - lastExecuteTime < debounceMs) {
        console.warn('操作过于频繁，请稍后再试');
        return;
      }

      // 重复点击防护
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setLastExecuteTime(now);

      try {
        const result = await asyncFn();
        onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('操作失败');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, lastExecuteTime, debounceMs, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}
