package com.agriverse.expert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomeStatisticsResponse {
    private BigDecimal qaIncome;              // 问答收入
    private BigDecimal appointmentIncome;     // 预约收入
    private BigDecimal adoptionIncome;         // 采纳奖励收入
    private BigDecimal totalIncome;            // 总收入
    private BigDecimal withdrawTotal;          // 累计提现
    private BigDecimal withdrawableBalance;   // 可提现余额
}



