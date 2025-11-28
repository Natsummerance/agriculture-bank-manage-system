package com.agriverse.bank.service;

import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 贷后管理服务
 */
@Service
@RequiredArgsConstructor
public class PostLoanService {
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 获取贷后监控数据
     */
    public Map<String, Object> getPostLoanMonitoring(String financingId) {
        FinancingApplication application = applicationRepository.findById(financingId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("融资申请不存在"));
        
        List<RepaymentSchedule> schedules = scheduleRepository
            .findByFinancingIdOrderByInstallmentNumberAsc(financingId);
        
        // 统计信息
        int totalInstallments = schedules.size();
        int paidInstallments = (int) schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID)
            .count();
        int pendingInstallments = (int) schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PENDING)
            .count();
        int overdueInstallments = (int) schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.OVERDUE)
            .count();
        
        // 金额统计
        BigDecimal totalAmount = schedules.stream()
            .map(RepaymentSchedule::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal paidAmount = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID)
            .map(RepaymentSchedule::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal pendingAmount = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PENDING)
            .map(RepaymentSchedule::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal overdueAmount = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.OVERDUE)
            .map(RepaymentSchedule::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算还款率
        BigDecimal repaymentRate = totalAmount.compareTo(BigDecimal.ZERO) > 0 ?
            paidAmount.divide(totalAmount, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        Map<String, Object> monitoring = new HashMap<>();
        monitoring.put("financingId", financingId);
        monitoring.put("application", application);
        monitoring.put("totalInstallments", totalInstallments);
        monitoring.put("paidInstallments", paidInstallments);
        monitoring.put("pendingInstallments", pendingInstallments);
        monitoring.put("overdueInstallments", overdueInstallments);
        monitoring.put("totalAmount", totalAmount);
        monitoring.put("paidAmount", paidAmount);
        monitoring.put("pendingAmount", pendingAmount);
        monitoring.put("overdueAmount", overdueAmount);
        monitoring.put("repaymentRate", repaymentRate);
        monitoring.put("schedules", schedules);
        
        return monitoring;
    }
    
    /**
     * 获取所有贷后监控列表
     */
    public List<Map<String, Object>> getAllPostLoanMonitoring() {
        List<FinancingApplication> applications = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.DISBURSED);
        applications.addAll(applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.REPAYING));
        
        return applications.stream()
            .map(a -> getPostLoanMonitoring(a.getId()))
            .collect(java.util.stream.Collectors.toList());
    }
}

