package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 趋势数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    private String name;  // 月份或日期
    private BigDecimal value; // 数值
}



