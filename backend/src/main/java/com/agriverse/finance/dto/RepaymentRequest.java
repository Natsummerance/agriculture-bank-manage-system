package com.agriverse.finance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 还款请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    private String scheduleId; // 正常还款时指定计划ID
    
    @NotNull(message = "还款金额不能为空")
    @DecimalMin(value = "0.01", message = "还款金额必须大于0")
    private BigDecimal amount;
    
    @NotBlank(message = "支付方式不能为空")
    private String paymentMethod;
    
    private String transactionId; // 交易流水号
}

