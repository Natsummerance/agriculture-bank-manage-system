package com.agriverse.bank.service;

import com.agriverse.bank.dto.DashboardStatisticsResponse;
import com.agriverse.bank.dto.TrendData;
import com.agriverse.bank.entity.Disbursement;
import com.agriverse.bank.repository.DisbursementRepository;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 银行仪表盘服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BankDashboardService {
    private final FinancingApplicationRepository applicationRepository;
    private final DisbursementRepository disbursementRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public DashboardStatisticsResponse getDashboardStatistics(String bankId) {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        
        // 今日放款统计
        List<Disbursement> todayDisbursements = disbursementRepository
            .findByStatusAndDisbursedAtBetween(
                Disbursement.DisbursementStatus.SUCCESS,
                todayStart, todayEnd);
        
        int todayDisbursedCount = todayDisbursements.size();
        BigDecimal todayDisbursedAmount = todayDisbursements.stream()
            .map(Disbursement::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 在贷余额统计
        List<FinancingApplication> outstandingApplications = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        int outstandingLoansCount = outstandingApplications.size();
        BigDecimal outstandingAmount = outstandingApplications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 待审批数量
        Long pendingApprovalsCount = applicationRepository
            .countByStatus(FinancingApplication.FinancingStatus.APPLIED);
        
        // 逾期融资数量
        LocalDate now = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findOverdueSchedules(now);
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        int overdueLoansCount = overdueFinancingIds.size();
        
        // 趋势数据（近6个月）
        List<TrendData> disbursementTrend = getDisbursementTrend(6);
        List<TrendData> balanceTrend = getBalanceTrend(6);
        
        return DashboardStatisticsResponse.builder()
            .todayDisbursedCount(todayDisbursedCount)
            .todayDisbursedAmount(todayDisbursedAmount)
            .outstandingLoansCount(outstandingLoansCount)
            .outstandingAmount(outstandingAmount)
            .pendingApprovalsCount(pendingApprovalsCount != null ? pendingApprovalsCount.intValue() : 0)
            .overdueLoansCount(overdueLoansCount)
            .disbursementTrend(disbursementTrend)
            .balanceTrend(balanceTrend)
            .build();
    }
    
    /**
     * 获取放款趋势
     */
    private List<TrendData> getDisbursementTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<Disbursement> disbursements = disbursementRepository
                .findByStatusAndDisbursedAtBetween(
                    Disbursement.DisbursementStatus.SUCCESS,
                    monthStart.atStartOfDay(),
                    monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = disbursements.stream()
                .map(Disbursement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取余额趋势
     */
    private List<TrendData> getBalanceTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthEnd = endDate.minusMonths(i).withDayOfMonth(1).plusMonths(1).minusDays(1);
            
            // 计算该月末的在贷余额（已放款且未结清的申请）
            List<FinancingApplication> applications = applicationRepository
                .findByStatusIn(List.of(
                    FinancingApplication.FinancingStatus.DISBURSED,
                    FinancingApplication.FinancingStatus.REPAYING));
            
            // 过滤出在该月末之前放款的申请
            BigDecimal balance = applications.stream()
                .filter(a -> a.getDisbursedAt() != null && 
                           a.getDisbursedAt().toLocalDate().isBefore(monthEnd.plusDays(1)))
                .map(FinancingApplication::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthEnd.format(DateTimeFormatter.ofPattern("M月")),
                balance
            ));
        }
        
        return trend;
    }
}



