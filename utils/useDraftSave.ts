import { useEffect, useRef } from 'react';
import { useDemandStore } from '../stores/demandStore';
import { toast } from 'sonner';

export function useDraftSave(interval: number = 30000) {
  const { saveDraft } = useDemandStore();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-save every 30 seconds
    timerRef.current = setInterval(async () => {
      try {
        await saveDraft();
        toast.success('草稿已自动保存', {
          duration: 2000,
          description: new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Fallback to IndexedDB if network fails
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [saveDraft, interval]);

  const manualSave = async () => {
    try {
      await saveDraft();
      toast.success('草稿已保存');
    } catch (error) {
      toast.error('保存失败，请检查网络连接');
    }
  };

  return { manualSave };
}
