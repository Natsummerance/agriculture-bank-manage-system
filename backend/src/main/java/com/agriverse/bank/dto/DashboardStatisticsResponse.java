package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * 仪表盘统计响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatisticsResponse {
    private Integer todayDisbursedCount;      // 今日放款笔数
    private BigDecimal todayDisbursedAmount;  // 今日放款金额
    private Integer outstandingLoansCount;     // 在贷余额笔数
    private BigDecimal outstandingAmount;      // 在贷余额金额
    private Integer pendingApprovalsCount;     // 待审批数量
    private Integer overdueLoansCount;         // 逾期融资数量
    private List<TrendData> disbursementTrend; // 放款趋势
    private List<TrendData> balanceTrend;      // 余额趋势
}



