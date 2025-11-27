package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 风险预警
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAlert {
    private String id;
    private String alertType;      // HIGH_RISK, OVERDUE, CREDIT_DOWN, ABNORMAL
    private String alertLevel;     // LOW, MEDIUM, HIGH, CRITICAL
    private String customerId;
    private String customerName;
    private String financingId;
    private String description;
    private LocalDateTime alertTime;
}



