/**
 * 还款组件 Hook
 * 支持正常还款和提前还款
 */

import { useState, useCallback } from 'react';

interface RepaymentInfo {
  loanId: string;
  principal: number;      // 本金
  interest: number;       // 利息
  remainingAmount: number; // 剩余金额
  dueDate: Date;          // 到期日
}

interface RepaymentOptions {
  type: 'normal' | 'advance'; // 正常还款 | 提前还款
  amount: number;
  paymentMethod: 'bank' | 'wechat' | 'alipay';
}

interface UseRepayModalReturn {
  isOpen: boolean;
  repaymentInfo: RepaymentInfo | null;
  openModal: (loanId: string) => Promise<void>;
  closeModal: () => void;
  submitRepayment: (options: RepaymentOptions) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useRepayModal(): UseRepayModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [repaymentInfo, setRepaymentInfo] = useState<RepaymentInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(async (loanId: string) => {
    setError(null);
    
    try {
      // 获取还款信息
      const response = await fetch(`/api/loan/${loanId}/repayment-info`);
      const data = await response.json();
      
      setRepaymentInfo({
        loanId,
        principal: data.principal,
        interest: data.interest,
        remainingAmount: data.remainingAmount,
        dueDate: new Date(data.dueDate),
      });
      
      setIsOpen(true);
    } catch (err) {
      setError('获取还款信息失败');
      console.error(err);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
    // 延迟清除数据，避免关闭动画时数据消失
    setTimeout(() => {
      setRepaymentInfo(null);
    }, 300);
  }, []);

  const submitRepayment = useCallback(
    async (options: RepaymentOptions) => {
      if (!repaymentInfo) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const endpoint = options.type === 'advance' 
          ? '/api/repay/advance' 
          : '/api/repay';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loanId: repaymentInfo.loanId,
            amount: options.amount,
            paymentMethod: options.paymentMethod,
          }),
        });

        if (!response.ok) {
          throw new Error('还款失败');
        }

        const result = await response.json();
        
        // 区块链存证（如果后端返回了 hash）
        if (result.blockchainHash) {
          console.log('区块链存证 Hash:', result.blockchainHash);
        }

        closeModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : '还款失败');
      } finally {
        setIsSubmitting(false);
      }
    },
    [repaymentInfo, closeModal]
  );

  return {
    isOpen,
    repaymentInfo,
    openModal,
    closeModal,
    submitRepayment,
    isSubmitting,
    error,
  };
}
