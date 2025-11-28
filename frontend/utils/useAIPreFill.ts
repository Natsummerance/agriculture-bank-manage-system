import { useState } from 'react';
import { useDemandStore } from '../stores/demandStore';
import { toast } from 'sonner';

export function useAIPreFill() {
  const [isLoading, setIsLoading] = useState(false);
  const { setMultipleFields, setField } = useDemandStore();

  const generateDescription = async () => {
    setIsLoading(true);
    try {
      // Mock AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockDescription = `我们需要采购优质农产品，要求如下：

**质量要求**：
- 产品需符合国家食品安全标准
- 无农药残留超标
- 色泽鲜艳，品相良好

**包装要求**：
- 采用环保包装材料
- 确保运输过程中不损坏
- 标注产地和生产日期

**其他说明**：
- 需提供质检报告
- 支持长期合作
- 价格可协商`;

      setField('description', mockDescription);
      toast.success('AI已生成需求描述');
    } catch (error) {
      toast.error('AI生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const fillFromHistory = async () => {
    setIsLoading(true);
    try {
      // Mock historical data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockHistoryData = {
        productName: '有机富硒苹果',
        category: ['水果', '苹果', '有机'],
        quantity: 500,
        unit: 'kg',
        priceExpectation: 12,
        deliveryLocation: {
          address: '北京市朝阳区建外大街1号',
          lat: 39.9087,
          lng: 116.4589,
        },
        description: '基于您的历史偏好，推荐采购有机富硒苹果，适合超市零售使用。',
        isPublic: true,
        allowBidding: true,
        autoExpireDays: 30,
      };

      setMultipleFields(mockHistoryData);
      toast.success('已使用历史偏好填充');
    } catch (error) {
      toast.error('填充失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateDescription,
    fillFromHistory,
  };
}
