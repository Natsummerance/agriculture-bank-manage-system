package com.agriverse.bank.service;

import com.agriverse.bank.entity.ReconciliationRecord;
import com.agriverse.bank.repository.ReconciliationRecordRepository;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentRecord;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentRecordRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 对账服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReconciliationService {
    private final ReconciliationRecordRepository reconciliationRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final RepaymentRecordRepository repaymentRecordRepository;
    
    /**
     * 自动对账（每天凌晨1点执行，对T-1日的数据进行对账）
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void autoReconcile() {
        log.info("开始自动对账");
        LocalDate yesterday = LocalDate.now().minusDays(1);
        reconcileByDate(yesterday);
        log.info("自动对账完成");
    }
    
    /**
     * 按日期对账
     */
    public int reconcileByDate(LocalDate date) {
        // 获取所有已放款的融资申请
        List<FinancingApplication> applications = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.DISBURSED);
        applications.addAll(applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.REPAYING));
        
        int count = 0;
        for (FinancingApplication application : applications) {
            try {
                ReconciliationRecord record = createReconciliationRecord(application, date);
                reconciliationRepository.save(record);
                count++;
            } catch (Exception e) {
                log.error("对账失败: financingId={}, error={}", application.getId(), e.getMessage());
            }
        }
        
        return count;
    }
    
    /**
     * 创建对账记录
     */
    private ReconciliationRecord createReconciliationRecord(FinancingApplication application, LocalDate date) {
        // 获取所有还款计划
        List<RepaymentSchedule> schedules = scheduleRepository
            .findByFinancingIdOrderByInstallmentNumberAsc(application.getId());
        
        // 获取所有还款记录
        List<RepaymentRecord> records = repaymentRecordRepository
            .findByFinancingIdOrderByPaidAtDesc(application.getId());
        
        // 计算已还本金和利息
        BigDecimal repaidPrincipal = records.stream()
            .map(RepaymentRecord::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal repaidInterest = records.stream()
            .map(RepaymentRecord::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算待还本金和利息
        List<RepaymentSchedule> pendingSchedules = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PENDING)
            .toList();
        
        BigDecimal pendingPrincipal = pendingSchedules.stream()
            .map(RepaymentSchedule::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal pendingInterest = pendingSchedules.stream()
            .map(RepaymentSchedule::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期本金和利息
        List<RepaymentSchedule> overdueSchedules = schedules.stream()
            .filter(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.OVERDUE)
            .toList();
        
        BigDecimal overduePrincipal = overdueSchedules.stream()
            .map(RepaymentSchedule::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal overdueInterest = overdueSchedules.stream()
            .map(RepaymentSchedule::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期罚息（假设为逾期金额的0.05%每天）
        BigDecimal overduePenalty = calculateOverduePenalty(overdueSchedules);
        
        // 计算差异
        BigDecimal disbursedAmount = application.getDisbursedAmount() != null ? 
            application.getDisbursedAmount() : application.getAmount();
        BigDecimal expectedTotal = repaidPrincipal.add(repaidInterest)
            .add(pendingPrincipal).add(pendingInterest)
            .add(overduePrincipal).add(overdueInterest);
        BigDecimal differenceAmount = disbursedAmount.subtract(expectedTotal);
        
        ReconciliationRecord.ReconciliationStatus status = 
            differenceAmount.abs().compareTo(BigDecimal.valueOf(0.01)) > 0 ?
            ReconciliationRecord.ReconciliationStatus.DIFFERENCE :
            ReconciliationRecord.ReconciliationStatus.NORMAL;
        
        return ReconciliationRecord.builder()
            .financingId(application.getId())
            .reconciliationDate(date)
            .disbursedAmount(disbursedAmount)
            .repaidPrincipal(repaidPrincipal)
            .repaidInterest(repaidInterest)
            .pendingPrincipal(pendingPrincipal)
            .pendingInterest(pendingInterest)
            .overduePrincipal(overduePrincipal)
            .overdueInterest(overdueInterest)
            .overduePenalty(overduePenalty)
            .status(status)
            .differenceAmount(differenceAmount)
            .differenceReason(status == ReconciliationRecord.ReconciliationStatus.DIFFERENCE ? 
                "对账金额与预期不符" : null)
            .build();
    }
    
    /**
     * 计算逾期罚息
     */
    private BigDecimal calculateOverduePenalty(List<RepaymentSchedule> overdueSchedules) {
        BigDecimal totalPenalty = BigDecimal.ZERO;
        LocalDate today = LocalDate.now();
        
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
     * 获取对账统计
     */
    public Map<String, Object> getReconciliationStatistics(LocalDate startDate, LocalDate endDate) {
        List<ReconciliationRecord> records = reconciliationRepository
            .findByReconciliationDateBetween(startDate, endDate);
        
        BigDecimal totalDisbursed = records.stream()
            .map(ReconciliationRecord::getDisbursedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalRepaid = records.stream()
            .map(r -> r.getRepaidPrincipal().add(r.getRepaidInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPending = records.stream()
            .map(r -> r.getPendingPrincipal().add(r.getPendingInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long differenceCount = records.stream()
            .filter(r -> r.getStatus() == ReconciliationRecord.ReconciliationStatus.DIFFERENCE)
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDisbursed", totalDisbursed);
        stats.put("totalRepaid", totalRepaid);
        stats.put("totalPending", totalPending);
        stats.put("differenceCount", differenceCount);
        stats.put("totalRecords", records.size());
        
        return stats;
    }
    
    /**
     * 获取对账列表
     */
    public List<ReconciliationRecord> getReconciliationList(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return reconciliationRepository.findByReconciliationDateBetween(startDate, endDate);
        }
        return reconciliationRepository.findAll();
    }
}



