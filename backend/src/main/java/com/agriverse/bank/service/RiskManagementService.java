package com.agriverse.bank.service;

import com.agriverse.bank.dto.RiskAlert;
import com.agriverse.bank.dto.RiskDashboardResponse;
import com.agriverse.bank.dto.TrendData;
import com.agriverse.bank.entity.CreditScore;
import com.agriverse.bank.entity.RiskIndicator;
import com.agriverse.bank.repository.CreditScoreRepository;
import com.agriverse.bank.repository.RiskIndicatorRepository;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 风险管理服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RiskManagementService {
    private final RiskIndicatorRepository indicatorRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final CreditScoreRepository creditScoreRepository;
    
    /**
     * 获取风控仪表盘数据
     */
    public RiskDashboardResponse getRiskDashboard() {
        // 获取最新风险指标
        RiskIndicator latest = indicatorRepository.findLatest()
            .orElseGet(this::calculateCurrentRiskIndicator);
        
        // 获取趋势数据（近6个月）
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);
        List<RiskIndicator> indicators = indicatorRepository
            .findByDateRange(startDate, endDate);
        
        List<TrendData> overdueRateTrend = indicators.stream()
            .map(i -> new TrendData(
                i.getIndicatorDate().format(DateTimeFormatter.ofPattern("M月")),
                i.getOverdueRate() != null ? i.getOverdueRate() : BigDecimal.ZERO
            ))
            .collect(Collectors.toList());
        
        List<TrendData> badDebtRateTrend = indicators.stream()
            .map(i -> new TrendData(
                i.getIndicatorDate().format(DateTimeFormatter.ofPattern("M月")),
                i.getBadDebtRate() != null ? i.getBadDebtRate() : BigDecimal.ZERO
            ))
            .collect(Collectors.toList());
        
        // 获取风险预警
        List<RiskAlert> riskAlerts = getRiskAlerts();
        
        return RiskDashboardResponse.builder()
            .currentOverdueRate(latest.getOverdueRate() != null ? latest.getOverdueRate() : BigDecimal.ZERO)
            .badDebtRate(latest.getBadDebtRate() != null ? latest.getBadDebtRate() : BigDecimal.ZERO)
            .creditBalance(latest.getCreditBalance() != null ? latest.getCreditBalance() : BigDecimal.ZERO)
            .jointLoanRatio(latest.getJointLoanRatio() != null ? latest.getJointLoanRatio() : BigDecimal.ZERO)
            .overdueRateTrend(overdueRateTrend)
            .badDebtRateTrend(badDebtRateTrend)
            .riskAlerts(riskAlerts)
            .build();
    }
    
    /**
     * 计算当前风险指标
     */
    public RiskIndicator calculateCurrentRiskIndicator() {
        // 获取所有在途贷款
        List<FinancingApplication> activeLoans = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        int totalLoans = activeLoans.size();
        BigDecimal totalAmount = activeLoans.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findOverdueSchedules(today);
        
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        
        int overdueLoans = overdueFinancingIds.size();
        BigDecimal overdueAmount = overdueSchedules.stream()
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期率
        BigDecimal overdueRate = totalAmount.compareTo(BigDecimal.ZERO) > 0 ?
            overdueAmount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        // 计算不良率（假设逾期90天以上为不良）
        long badDebtDays = 90;
        LocalDate badDebtDate = today.minusDays(badDebtDays);
        int badDebtLoans = (int) overdueSchedules.stream()
            .filter(s -> s.getDueDate().isBefore(badDebtDate))
            .map(RepaymentSchedule::getFinancingId)
            .distinct()
            .count();
        
        BigDecimal badDebtAmount = overdueSchedules.stream()
            .filter(s -> s.getDueDate().isBefore(badDebtDate))
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal badDebtRate = totalAmount.compareTo(BigDecimal.ZERO) > 0 ?
            badDebtAmount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        // 计算联合贷占比（假设有productId的是联合贷）
        long jointLoanCount = activeLoans.stream()
            .filter(a -> a.getProductId() != null)
            .count();
        
        BigDecimal jointLoanRatio = totalLoans > 0 ?
            BigDecimal.valueOf(jointLoanCount)
                .divide(BigDecimal.valueOf(totalLoans), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        return RiskIndicator.builder()
            .id(UUID.randomUUID().toString())
            .indicatorDate(LocalDate.now())
            .totalLoans(totalLoans)
            .totalAmount(totalAmount)
            .overdueLoans(overdueLoans)
            .overdueAmount(overdueAmount)
            .overdueRate(overdueRate)
            .badDebtLoans(badDebtLoans)
            .badDebtAmount(badDebtAmount)
            .badDebtRate(badDebtRate)
            .creditBalance(totalAmount)
            .jointLoanRatio(jointLoanRatio)
            .build();
    }
    
    /**
     * 计算每日风险指标（定时任务）
     */
    @Scheduled(cron = "0 0 1 * * ?") // 每天凌晨1点执行
    public void calculateDailyRiskIndicator() {
        LocalDate today = LocalDate.now();
        
        // 检查是否已计算
        if (indicatorRepository.findByIndicatorDate(today).isPresent()) {
            return;
        }
        
        RiskIndicator indicator = calculateCurrentRiskIndicator();
        indicator.setIndicatorDate(today);
        indicatorRepository.save(indicator);
        log.info("风险指标计算完成: {}", today);
    }
    
    /**
     * 获取风险预警列表
     */
    public List<RiskAlert> getRiskAlerts() {
        List<RiskAlert> alerts = new ArrayList<>();
        
        // 高风险客户预警
        List<CreditScore> lowCreditScores = creditScoreRepository.findAll().stream()
            .filter(cs -> cs.getTotalScore() < 60)
            .collect(Collectors.toList());
        
        for (CreditScore cs : lowCreditScores) {
            alerts.add(RiskAlert.builder()
                .id(UUID.randomUUID().toString())
                .alertType("HIGH_RISK")
                .alertLevel("HIGH")
                .customerId(cs.getFarmerId())
                .description("客户信用评分低于60分")
                .alertTime(LocalDateTime.now())
                .build());
        }
        
        // 逾期预警
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        
        for (String financingId : overdueFinancingIds) {
            FinancingApplication application = applicationRepository.findById(financingId)
                .orElse(null);
            if (application != null) {
                alerts.add(RiskAlert.builder()
                    .id(UUID.randomUUID().toString())
                    .alertType("OVERDUE")
                    .alertLevel("MEDIUM")
                    .customerId(application.getFarmerId())
                    .financingId(financingId)
                    .description("融资申请存在逾期还款")
                    .alertTime(LocalDateTime.now())
                    .build());
            }
        }
        
        return alerts;
    }
}



