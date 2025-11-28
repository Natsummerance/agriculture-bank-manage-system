package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 审批请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "审批结果不能为空")
    private String action; // APPROVE 或 REJECT
    
    private String reviewComment; // 审批意见
    
    private Integer creditScore; // 信用评分（批准时）
    
    private BigDecimal interestRate; // 实际利率（批准时）
}

