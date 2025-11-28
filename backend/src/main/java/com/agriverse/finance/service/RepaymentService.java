package com.agriverse.finance.service;

import com.agriverse.exception.BusinessException;
import com.agriverse.finance.dto.EarlyRepaymentCalculateRequest;
import com.agriverse.finance.dto.RepaymentRequest;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentRecord;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentRecordRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import com.agriverse.notification.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 还款服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RepaymentService {
    private final RepaymentRecordRepository repaymentRecordRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    
    /**
     * 正常还款
     */
    public RepaymentRecord repay(RepaymentRequest request) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        RepaymentSchedule schedule = null;
        if (request.getScheduleId() != null) {
            schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new EntityNotFoundException("还款计划不存在"));
            
            if (schedule.getStatus() == RepaymentSchedule.ScheduleStatus.PAID) {
                throw new BusinessException("该期已还款");
            }
        }
        
        // 创建还款记录
        RepaymentRecord record = RepaymentRecord.builder()
            .financingId(request.getFinancingId())
            .scheduleId(request.getScheduleId())
            .repaymentType(RepaymentRecord.RepaymentType.NORMAL)
            .amount(request.getAmount())
            .principal(schedule != null ? schedule.getPrincipal() : request.getAmount())
            .interest(schedule != null ? schedule.getInterest() : BigDecimal.ZERO)
            .penalty(BigDecimal.ZERO)
            .paymentMethod(request.getPaymentMethod())
            .transactionId(request.getTransactionId())
            .paidAt(java.time.LocalDateTime.now())
            .build();
        
        // 更新还款计划状态
        if (schedule != null) {
            schedule.setStatus(RepaymentSchedule.ScheduleStatus.PAID);
            schedule.setPaidAt(java.time.LocalDateTime.now());
            schedule.setPaidAmount(request.getAmount());
            scheduleRepository.save(schedule);
        }
        
        // 检查是否全部还清
        List<RepaymentSchedule> allSchedules = scheduleRepository.findByFinancingIdOrderByInstallmentNumberAsc(request.getFinancingId());
        boolean allPaid = allSchedules.stream()
            .allMatch(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID);
        
        if (allPaid) {
            application.setStatus(FinancingApplication.FinancingStatus.SETTLED);
            applicationRepository.save(application);
        } else {
            application.setStatus(FinancingApplication.FinancingStatus.REPAYING);
            applicationRepository.save(application);
        }
        
        RepaymentRecord saved = repaymentRecordRepository.save(record);
        
        // 发送还款成功通知（可选，这里暂时不发送，避免频繁通知）
        
        return saved;
    }
    
    /**
     * 提前还款试算
     */
    public Map<String, Object> calculateEarlyRepayment(EarlyRepaymentCalculateRequest request) {
        // 验证融资申请存在
        applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        List<RepaymentSchedule> schedules = scheduleRepository
            .findByFinancingIdAndStatus(request.getFinancingId(), RepaymentSchedule.ScheduleStatus.PENDING);
        
        // 计算剩余本金
        BigDecimal remainingPrincipal = schedules.stream()
            .map(RepaymentSchedule::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算提前还款违约金（假设为剩余本金的1%）
        BigDecimal penalty = remainingPrincipal.multiply(BigDecimal.valueOf(0.01));
        
        // 计算总还款金额
        BigDecimal totalAmount = request.getAmount().add(penalty);
        
        // 计算节省的利息
        BigDecimal savedInterest = schedules.stream()
            .map(RepaymentSchedule::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> result = new HashMap<>();
        result.put("remainingPrincipal", remainingPrincipal);
        result.put("penalty", penalty);
        result.put("totalAmount", totalAmount);
        result.put("savedInterest", savedInterest);
        
        return result;
    }
    
    /**
     * 获取还款记录列表
     */
    public List<RepaymentRecord> getRepaymentRecords(String financingId) {
        return repaymentRecordRepository.findByFinancingIdOrderByPaidAtDesc(financingId);
    }
    
    /**
     * 获取还款计划列表
     */
    public List<RepaymentSchedule> getRepaymentSchedules(String financingId) {
        return scheduleRepository.findByFinancingIdOrderByInstallmentNumberAsc(financingId);
    }
}

