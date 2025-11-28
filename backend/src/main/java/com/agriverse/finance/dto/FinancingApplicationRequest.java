package com.agriverse.finance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 融资申请请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplicationRequest {
    @NotNull(message = "申请金额不能为空")
    @DecimalMin(value = "0.01", message = "申请金额必须大于0")
    private BigDecimal amount;
    
    @NotNull(message = "期限不能为空")
    @Min(value = 1, message = "期限至少1个月")
    @Max(value = 120, message = "期限不能超过120个月")
    private Integer termMonths;
    
    @NotBlank(message = "资金用途不能为空")
    @Size(max = 500, message = "资金用途不能超过500字符")
    private String purpose;
    
    private String productId; // 可选，如果选择特定产品
}

