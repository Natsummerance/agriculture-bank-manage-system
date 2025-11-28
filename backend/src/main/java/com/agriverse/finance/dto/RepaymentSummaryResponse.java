package com.agriverse.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 还款汇总响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentSummaryResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 总期数
     */
    private Integer totalInstallments;
    
    /**
     * 已还期数
     */
    private Integer paidInstallments;
    
    /**
     * 待还期数
     */
    private Integer pendingInstallments;
    
    /**
     * 逾期期数
     */
    private Integer overdueInstallments;
    
    /**
     * 总还款金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 已还金额
     */
    private BigDecimal paidAmount;
    
    /**
     * 待还金额
     */
    private BigDecimal pendingAmount;
    
    /**
     * 逾期金额
     */
    private BigDecimal overdueAmount;
    
    /**
     * 已还本金
     */
    private BigDecimal paidPrincipal;
    
    /**
     * 已还利息
     */
    private BigDecimal paidInterest;
}



