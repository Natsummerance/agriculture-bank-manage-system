import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useFarmerFinance = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate] = useState(4.5);

  const openFinanceCalc = () => {
    setIsOpen(true);
  };

  const closeFinanceCalc = () => {
    setIsOpen(false);
  };

  // 计算月还款额
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return payment.toFixed(2);
  };

  // 计算总利息
  const calculateTotalInterest = () => {
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const totalPayment = monthlyPayment * loanTerm;
    return (totalPayment - loanAmount).toFixed(2);
  };

  const handleApplyNow = () => {
    closeFinanceCalc();
    toast.success('跳转到贷款申请页面...');
    setTimeout(() => {
      // 导航到贷款申请页面（假设路由已配置）
      window.dispatchEvent(new CustomEvent('navigate-to-loan-apply'));
    }, 500);
  };

  return {
    isOpen,
    loanAmount,
    loanTerm,
    interestRate,
    setLoanAmount,
    setLoanTerm,
    openFinanceCalc,
    closeFinanceCalc,
    calculateMonthlyPayment,
    calculateTotalInterest,
    handleApplyNow,
  };
};
