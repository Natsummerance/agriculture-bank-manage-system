package com.agriverse.expert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertDashboardStatisticsResponse {
    private Integer pendingQuestionsCount;      // 待回答问题数
    private Integer answeredQuestionsCount;    // 已回答问题数
    private BigDecimal totalIncome;            // 总收入
    private BigDecimal withdrawableBalance;     // 可提现余额
    private Integer availableSlotsCount;        // 可用时段数
    private Integer bookedSlotsCount;           // 已预约时段数
    private List<TrendData> incomeTrend;        // 收入趋势
    private List<TrendData> qaTrend;            // 问答趋势
    private List<TrendData> appointmentTrend;   // 预约趋势
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData {
        private String name;   // 月份或日期
        private BigDecimal value; // 数值
    }
}



