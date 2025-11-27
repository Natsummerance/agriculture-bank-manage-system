package com.agriverse.bank.service;

import com.agriverse.bank.dto.ApprovalRequest;
import com.agriverse.bank.dto.CreditScoreRequest;
import com.agriverse.bank.entity.CreditScore;
import com.agriverse.bank.repository.CreditScoreRepository;
import com.agriverse.exception.BusinessException;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.FinancingTimeline;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.service.FinancingApplicationService;
import com.agriverse.notification.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 银行审批服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BankApprovalService {
    private final FinancingApplicationRepository applicationRepository;
    private final FinancingApplicationService financingApplicationService;
    private final CreditScoreRepository creditScoreRepository;
    private final NotificationService notificationService;
    
    /**
     * 获取待审批列表
     */
    public java.util.List<FinancingApplication> getPendingApplications() {
        return applicationRepository.findByStatus(FinancingApplication.FinancingStatus.APPLIED);
    }
    
    /**
     * 审批融资申请
     */
    public FinancingApplication approveApplication(ApprovalRequest request, String reviewerId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.APPLIED &&
            application.getStatus() != FinancingApplication.FinancingStatus.REVIEWING) {
            throw new BusinessException("当前状态不允许审批");
        }
        
        if ("APPROVE".equals(request.getAction())) {
            application.setStatus(FinancingApplication.FinancingStatus.APPROVED);
            application.setReviewerId(reviewerId);
            application.setReviewedAt(java.time.LocalDateTime.now());
            application.setReviewComment(request.getReviewComment());
            if (request.getCreditScore() != null) {
                application.setCreditScore(request.getCreditScore());
            }
            if (request.getInterestRate() != null) {
                application.setInterestRate(request.getInterestRate());
            }
            
            // 生成还款计划
            financingApplicationService.generateRepaymentSchedule(application);
            
            // 添加时间线
            financingApplicationService.addTimeline(application.getId(), 
                FinancingTimeline.ActorType.BANK, reviewerId, "审批通过", request.getReviewComment());
            
            // 发送审批通过通知
            notificationService.sendApprovalNotification(application.getFarmerId(), 
                application.getId(), "APPROVED", request.getReviewComment());
        } else if ("REJECT".equals(request.getAction())) {
            application.setStatus(FinancingApplication.FinancingStatus.REJECTED);
            application.setReviewerId(reviewerId);
            application.setReviewedAt(java.time.LocalDateTime.now());
            application.setReviewComment(request.getReviewComment());
            
            // 添加时间线
            financingApplicationService.addTimeline(application.getId(), 
                FinancingTimeline.ActorType.BANK, reviewerId, "审批拒绝", request.getReviewComment());
            
            // 发送审批拒绝通知
            notificationService.sendApprovalNotification(application.getFarmerId(), 
                application.getId(), "REJECTED", request.getReviewComment());
        }
        
        return applicationRepository.save(application);
    }
    
    /**
     * 计算信用评分
     */
    public CreditScore calculateCreditScore(CreditScoreRequest request, String reviewerId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        // 计算各项评分
        int creditHistoryScore = request.getCreditHistoryScore() != null ? 
            request.getCreditHistoryScore() : 70;
        
        // 收入评分：年收入/10000，最高50分
        int incomeScore = Math.min(
            request.getIncome().divide(BigDecimal.valueOf(10000), 0, RoundingMode.DOWN).intValue(), 
            50
        );
        
        // 资产评分：资产总额/100000，最高30分
        int assetScore = Math.min(
            request.getAssets().divide(BigDecimal.valueOf(100000), 0, RoundingMode.DOWN).intValue(), 
            30
        );
        
        // 负债率评分：(100 - 负债率) * 0.15
        int debtRatioScore = (100 - request.getDebtRatio()) * 15 / 100;
        
        int experienceScore = request.getIndustryExperience() != null ? 
            request.getIndustryExperience() : 70;
        
        // 综合评分
        int totalScore = (int)(creditHistoryScore * 0.3 + incomeScore * 0.2 + 
                              assetScore * 0.2 + debtRatioScore * 0.15 + experienceScore * 0.15);
        
        // 风险等级
        CreditScore.RiskLevel riskLevel;
        if (totalScore >= 80) {
            riskLevel = CreditScore.RiskLevel.LOW;
        } else if (totalScore >= 60) {
            riskLevel = CreditScore.RiskLevel.MEDIUM;
        } else {
            riskLevel = CreditScore.RiskLevel.HIGH;
        }
        
        // 建议额度
        BigDecimal suggestedAmount = BigDecimal.valueOf(totalScore * 1000);
        
        CreditScore creditScore = CreditScore.builder()
            .financingId(request.getFinancingId())
            .farmerId(application.getFarmerId())
            .creditHistoryScore(creditHistoryScore)
            .incomeScore(incomeScore)
            .assetScore(assetScore)
            .debtRatioScore(debtRatioScore)
            .experienceScore(experienceScore)
            .totalScore(totalScore)
            .riskLevel(riskLevel)
            .suggestedAmount(suggestedAmount)
            .reviewerId(reviewerId)
            .reviewedAt(java.time.LocalDateTime.now())
            .build();
        
        return creditScoreRepository.save(creditScore);
    }
}

