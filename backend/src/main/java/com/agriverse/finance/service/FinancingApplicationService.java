package com.agriverse.finance.service;

import com.agriverse.bank.entity.LoanProduct;
import com.agriverse.bank.repository.LoanProductRepository;
import com.agriverse.exception.BusinessException;
import com.agriverse.finance.dto.FinancingApplicationRequest;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.FinancingTimeline;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.FinancingTimelineRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 融资申请服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FinancingApplicationService {
    private final FinancingApplicationRepository applicationRepository;
    private final FinancingTimelineRepository timelineRepository;
    private final LoanProductRepository productRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 创建融资申请
     */
    public FinancingApplication createApplication(FinancingApplicationRequest request, String farmerId) {
        // 检查是否有最低额度限制
        List<LoanProduct> products = productRepository.findByStatus(LoanProduct.ProductStatus.ACTIVE);
        if (products.isEmpty()) {
            throw new BusinessException("暂无可用的贷款产品");
        }
        
        BigDecimal minAmount = products.stream()
            .map(LoanProduct::getMinAmount)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.valueOf(200000));
        
        // 如果金额低于最低额度，返回特殊标识，前端引导进入拼单流程
        if (request.getAmount().compareTo(minAmount) < 0) {
            throw new BusinessException("APPLY_JOINT_LOAN", "申请金额低于最低额度，建议使用智能拼单");
        }
        
        FinancingApplication application = FinancingApplication.builder()
            .farmerId(farmerId)
            .productId(request.getProductId())
            .amount(request.getAmount())
            .termMonths(request.getTermMonths())
            .purpose(request.getPurpose())
            .status(FinancingApplication.FinancingStatus.APPLIED)
            .build();
        
        FinancingApplication saved = applicationRepository.save(application);
        
        // 创建时间线记录
        addTimeline(saved.getId(), FinancingTimeline.ActorType.FARMER, farmerId, 
                   "提交融资申请", request.getPurpose());
        
        return saved;
    }
    
    /**
     * 获取农户的融资申请列表
     */
    public List<FinancingApplication> getFarmerApplications(String farmerId, String status) {
        if (status != null && !status.isEmpty()) {
            try {
                FinancingApplication.FinancingStatus statusEnum = 
                    FinancingApplication.FinancingStatus.valueOf(status);
                return applicationRepository.findByFarmerIdAndStatus(farmerId, statusEnum);
            } catch (IllegalArgumentException e) {
                return applicationRepository.findByFarmerId(farmerId);
            }
        }
        return applicationRepository.findByFarmerId(farmerId);
    }
    
    /**
     * 获取融资申请详情
     */
    public FinancingApplication getApplicationById(String id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
    }
    
    /**
     * 添加时间线记录
     */
    public void addTimeline(String financingId, FinancingTimeline.ActorType actor, 
                           String actorId, String action, String note) {
        FinancingTimeline timeline = FinancingTimeline.builder()
            .financingId(financingId)
            .actor(actor)
            .actorId(actorId)
            .action(action)
            .note(note)
            .build();
        timelineRepository.save(timeline);
    }
    
    /**
     * 生成还款计划（等额本息）
     */
    public List<RepaymentSchedule> generateRepaymentSchedule(FinancingApplication application) {
        BigDecimal amount = application.getAmount();
        BigDecimal rate = application.getInterestRate() != null ? 
            application.getInterestRate().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP) :
            BigDecimal.valueOf(0.055); // 默认5.5%
        int termMonths = application.getTermMonths();
        
        // 等额本息计算公式：每月还款额 = [贷款本金×月利率×(1+月利率)^还款月数]÷[(1+月利率)^还款月数－1]
        BigDecimal monthlyRate = rate.divide(BigDecimal.valueOf(12), 6, RoundingMode.HALF_UP);
        double powValue = Math.pow(monthlyRate.add(BigDecimal.ONE).doubleValue(), termMonths);
        BigDecimal pow = BigDecimal.valueOf(powValue);
        BigDecimal monthlyPayment = amount.multiply(monthlyRate).multiply(pow)
            .divide(pow.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal remainingPrincipal = amount;
        LocalDate startDate = LocalDate.now();
        
        for (int i = 1; i <= termMonths; i++) {
            RepaymentSchedule schedule = RepaymentSchedule.builder()
                .financingId(application.getId())
                .installmentNumber(i)
                .dueDate(startDate.plusMonths(i))
                .status(RepaymentSchedule.ScheduleStatus.PENDING)
                .build();
            
            // 计算利息
            BigDecimal interest = remainingPrincipal.multiply(monthlyRate)
                .setScale(2, RoundingMode.HALF_UP);
            
            // 计算本金
            BigDecimal principal = monthlyPayment.subtract(interest);
            if (i == termMonths) {
                // 最后一期，本金 = 剩余本金
                principal = remainingPrincipal;
            }
            
            schedule.setPrincipal(principal);
            schedule.setInterest(interest);
            schedule.setTotalAmount(monthlyPayment);
            
            remainingPrincipal = remainingPrincipal.subtract(principal);
            schedules.add(schedule);
        }
        
        return scheduleRepository.saveAll(schedules);
    }
    
    /**
     * 更新融资申请状态
     */
    @Transactional
    public FinancingApplication updateStatus(String id, FinancingApplication.FinancingStatus status) {
        FinancingApplication application = getApplicationById(id);
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}



