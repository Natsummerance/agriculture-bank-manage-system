package com.agriverse.bank.service;

import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import com.agriverse.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 逾期管理服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OverdueManagementService {
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final NotificationService notificationService;
    
    /**
     * 获取逾期统计
     */
    public Map<String, Object> getOverdueStatistics() {
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        
        // 按融资申请分组
        Map<String, List<RepaymentSchedule>> groupedByFinancing = overdueSchedules.stream()
            .collect(Collectors.groupingBy(RepaymentSchedule::getFinancingId));
        
        int overdueCount = groupedByFinancing.size();
        
        BigDecimal totalOverdueAmount = overdueSchedules.stream()
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期天数
        List<Long> overdueDaysList = overdueSchedules.stream()
            .map(s -> java.time.temporal.ChronoUnit.DAYS.between(s.getDueDate(), today))
            .collect(Collectors.toList());
        
        long maxOverdueDays = overdueDaysList.stream().mapToLong(Long::longValue).max().orElse(0);
        double avgOverdueDays = overdueDaysList.isEmpty() ? 0 : 
            overdueDaysList.stream().mapToLong(Long::longValue).average().orElse(0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("overdueCount", overdueCount);
        stats.put("totalOverdueAmount", totalOverdueAmount);
        stats.put("maxOverdueDays", maxOverdueDays);
        stats.put("avgOverdueDays", avgOverdueDays);
        stats.put("overdueSchedulesCount", overdueSchedules.size());
        
        return stats;
    }
    
    /**
     * 获取逾期列表
     */
    public List<Map<String, Object>> getOverdueList() {
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        
        // 按融资申请分组
        Map<String, List<RepaymentSchedule>> groupedByFinancing = overdueSchedules.stream()
            .collect(Collectors.groupingBy(RepaymentSchedule::getFinancingId));
        
        return groupedByFinancing.entrySet().stream().map(entry -> {
            String financingId = entry.getKey();
            List<RepaymentSchedule> schedules = entry.getValue();
            
            FinancingApplication application = applicationRepository.findById(financingId)
                .orElse(null);
            
            BigDecimal overdueAmount = schedules.stream()
                .map(s -> s.getPrincipal().add(s.getInterest()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            LocalDate firstDueDate = schedules.stream()
                .map(RepaymentSchedule::getDueDate)
                .min(LocalDate::compareTo)
                .orElse(today);
            
            long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(firstDueDate, today);
            
            Map<String, Object> item = new HashMap<>();
            item.put("financingId", financingId);
            item.put("farmerId", application != null ? application.getFarmerId() : null);
            item.put("amount", application != null ? application.getAmount() : null);
            item.put("overdueAmount", overdueAmount);
            item.put("overdueCount", schedules.size());
            item.put("overdueDays", overdueDays);
            item.put("firstDueDate", firstDueDate);
            item.put("schedules", schedules);
            
            return item;
        }).collect(Collectors.toList());
    }
    
    /**
     * 计算逾期罚息
     */
    public BigDecimal calculateOverduePenalty(String financingId) {
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findByFinancingIdAndStatus(financingId, RepaymentSchedule.ScheduleStatus.OVERDUE);
        
        BigDecimal totalPenalty = BigDecimal.ZERO;
        
        for (RepaymentSchedule schedule : overdueSchedules) {
            long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(schedule.getDueDate(), today);
            if (overdueDays > 0) {
                BigDecimal overdueAmount = schedule.getPrincipal().add(schedule.getInterest());
                // 罚息 = 逾期金额 × 0.05% × 逾期天数
                BigDecimal penalty = overdueAmount
                    .multiply(BigDecimal.valueOf(0.0005))
                    .multiply(BigDecimal.valueOf(overdueDays));
                totalPenalty = totalPenalty.add(penalty);
            }
        }
        
        return totalPenalty.setScale(2, java.math.RoundingMode.HALF_UP);
    }
    
    /**
     * 发送逾期提醒
     */
    public void sendOverdueAlert(String financingId) {
        FinancingApplication application = applicationRepository.findById(financingId)
            .orElse(null);
        
        if (application == null) {
            log.warn("融资申请不存在: financingId={}", financingId);
            return;
        }
        
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findByFinancingIdAndStatus(financingId, RepaymentSchedule.ScheduleStatus.OVERDUE);
        
        if (overdueSchedules.isEmpty()) {
            return;
        }
        
        BigDecimal overdueAmount = overdueSchedules.stream()
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        LocalDate firstDueDate = overdueSchedules.stream()
            .map(RepaymentSchedule::getDueDate)
            .min(LocalDate::compareTo)
            .orElse(today);
        
        long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(firstDueDate, today);
        
        notificationService.sendOverdueAlert(application.getFarmerId(), 
            financingId, overdueAmount, overdueDays);
    }
}

