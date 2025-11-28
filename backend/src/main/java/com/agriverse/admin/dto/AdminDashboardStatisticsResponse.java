package com.agriverse.admin.dto;

import com.agriverse.bank.dto.TrendData;
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
public class AdminDashboardStatisticsResponse {
    private Long todayPV;              // 今日PV
    private Long totalPV;               // 累计PV
    private Long todayUV;              // 今日UV
    private Long totalUV;               // 累计UV
    private BigDecimal todayRevenue;   // 今日交易额
    private BigDecimal totalRevenue;   // 累计交易额
    private Integer todayOrders;        // 今日订单数
    private Integer totalOrders;        // 累计订单数
    private Integer pendingProducts;   // 待审核商品数
    private Integer pendingContent;    // 待审核内容数
    private Integer activeFinancing;   // 在途融资数
    private BigDecimal totalFinancingAmount; // 融资总额
    private List<TrendData> orderTrend;     // 订单趋势
    private List<TrendData> revenueTrend;   // 交易额趋势
}



