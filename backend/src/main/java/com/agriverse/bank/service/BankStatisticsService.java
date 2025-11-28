package com.agriverse.bank.service;

import com.agriverse.bank.repository.DisbursementRepository;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 银行统计服务
 */
@Service
@RequiredArgsConstructor
public class BankStatisticsService {
    private final FinancingApplicationRepository applicationRepository;
    private final DisbursementRepository disbursementRepository;
    
    /**
     * 获取审批统计
     */
    public Map<String, Object> getApprovalStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // 待审批数量
        long pendingCount = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.APPLIED).size();
        
        // 已通过数量
        long approvedCount = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.APPROVED).size();
        
        // 已拒绝数量
        long rejectedCount = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.REJECTED).size();
        
        // 已放款数量
        long disbursedCount = applicationRepository.findByStatus(
            FinancingApplication.FinancingStatus.DISBURSED).size();
        
        stats.put("pendingCount", pendingCount);
        stats.put("approvedCount", approvedCount);
        stats.put("rejectedCount", rejectedCount);
        stats.put("disbursedCount", disbursedCount);
        stats.put("totalCount", pendingCount + approvedCount + rejectedCount + disbursedCount);
        
        return stats;
    }
    
    /**
     * 获取放款统计
     */
    public Map<String, Object> getDisbursementStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        // 放款总金额
        BigDecimal totalAmount = disbursementRepository.getTotalDisbursedAmount(startDate, endDate);
        
        // 放款成功数量
        long successCount = disbursementRepository.findByStatus(
            com.agriverse.bank.entity.Disbursement.DisbursementStatus.SUCCESS).size();
        
        // 待放款数量
        long pendingCount = disbursementRepository.findByStatus(
            com.agriverse.bank.entity.Disbursement.DisbursementStatus.PENDING).size();
        
        stats.put("totalAmount", totalAmount);
        stats.put("successCount", successCount);
        stats.put("pendingCount", pendingCount);
        stats.put("totalCount", successCount + pendingCount);
        
        return stats;
    }
}



