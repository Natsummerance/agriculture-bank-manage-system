package com.agriverse.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 还款计划响应DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentScheduleResponse {
    private String id;
    private String financingId;
    private Integer installmentNumber;
    private LocalDate dueDate;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal totalAmount;
    private String status; // PENDING, PAID, OVERDUE
    private LocalDateTime paidAt;
    private BigDecimal paidAmount;
}



