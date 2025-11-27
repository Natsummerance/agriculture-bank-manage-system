package com.agriverse.expert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePriceUpdateRequest {
    private BigDecimal servicePrice; // 预约咨询价格
    private BigDecimal qaPrice;      // 问答价格
}



