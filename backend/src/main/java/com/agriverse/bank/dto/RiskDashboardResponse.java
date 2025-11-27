package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * 风控仪表盘响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskDashboardResponse {
    private BigDecimal currentOverdueRate;    // 当前逾期率
    private BigDecimal badDebtRate;           // 不良率
    private BigDecimal creditBalance;         // 授信余额
    private BigDecimal jointLoanRatio;         // 联合贷占比
    private List<TrendData> overdueRateTrend;  // 逾期率趋势
    private List<TrendData> badDebtRateTrend;  // 不良率趋势
    private List<RiskAlert> riskAlerts;        // 风险预警列表
}



