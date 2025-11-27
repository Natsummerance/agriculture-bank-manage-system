package com.agriverse.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatisticsResponse {
    private Long totalOrders;              // 订单总数
    private BigDecimal totalAmount;        // 订单总额
    private Integer todayOrders;            // 今日订单数
    private BigDecimal todayAmount;        // 今日订单额
    private Map<String, Long> statusDistribution; // 订单状态分布
    private Map<String, Long> refundStatusDistribution; // 退款状态分布
}



