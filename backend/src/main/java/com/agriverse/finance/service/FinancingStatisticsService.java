package com.agriverse.finance.service;

import com.agriverse.finance.dto.RepaymentSummaryResponse;
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
 * 融资统计服务
 */
@Service
@RequiredArgsConstructor
public class FinancingStatisticsService {
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 获取农户融资统计
     */
    public Map<String, Object> getFarmerStatistics(String farmerId) {
        Map<String, Object> stats = new HashMap<>();
        
        List<FinancingApplication> applications = applicationRepository.findByFarmerId(farmerId);
        
        // 申请总数
        long totalApplications = applications.size();
        
        // 各状态数量
        long appliedCount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPLIED)
            .count();
        long approvedCount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPROVED)
            .count();
        long repayingCount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .count();
        long settledCount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.SETTLED)
            .count();
        
        // 总申请金额
        BigDecimal totalAmount = applications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 已放款金额
        BigDecimal disbursedAmount = applications.stream()
            .filter(a -> a.getDisbursedAmount() != null)
            .map(FinancingApplication::getDisbursedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalApplications", totalApplications);
        stats.put("appliedCount", appliedCount);
        stats.put("approvedCount", approvedCount);
        stats.put("repayingCount", repayingCount);
        stats.put("settledCount", settledCount);
        stats.put("totalAmount", totalAmount);
        stats.put("disbursedAmount", disbursedAmount);
        
        return stats;
    }
    
    /**
     * 获取还款汇总
     */
    public RepaymentSummaryResponse getRepaymentSummary(String financingId) {
        List<RepaymentSchedule> schedules = scheduleRepository
            .findByFinancingIdOrderByInstallmentNumberAsc(financingId);
        
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
        
        // 计算已还本金和利息
        BigDecimal paidPrincipal = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID)
            .map(RepaymentSchedule::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal paidInterest = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID)
            .map(RepaymentSchedule::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return RepaymentSummaryResponse.builder()
            .totalInstallments(totalInstallments)
            .paidInstallments(paidInstallments)
            .pendingInstallments(pendingInstallments)
            .overdueInstallments(overdueInstallments)
            .totalAmount(totalAmount)
            .paidAmount(paidAmount)
            .pendingAmount(pendingAmount)
            .overdueAmount(overdueAmount)
            .paidPrincipal(paidPrincipal)
            .paidInterest(paidInterest)
            .build();
    }
}

