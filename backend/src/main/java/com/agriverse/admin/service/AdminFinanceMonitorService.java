package com.agriverse.admin.service;

import com.agriverse.admin.dto.FinanceMonitorResponse;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFinanceMonitorService {
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 获取融资监控数据
     */
    public FinanceMonitorResponse getFinanceMonitor() {
        List<FinancingApplication> allApplications = applicationRepository.findAll();
        
        Integer totalApplications = allApplications.size();
        Integer pendingApprovals = (int) allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPLIED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REVIEWING)
            .count();
        Integer approvedCount = (int) allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPROVED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.SIGNED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED)
            .count();
        
        BigDecimal totalAmount = allApplications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal repayingAmount = allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return FinanceMonitorResponse.builder()
            .totalApplications(totalApplications)
            .pendingApprovals(pendingApprovals)
            .approvedCount(approvedCount)
            .totalAmount(totalAmount)
            .repayingAmount(repayingAmount)
            .applications(allApplications)
            .build();
    }
}



