package com.agriverse.bank.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 贷款产品请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanProductRequest {
    @NotBlank(message = "产品名称不能为空")
    @Size(max = 200, message = "产品名称不能超过200字符")
    private String name;
    
    @NotNull(message = "年利率不能为空")
    @DecimalMin(value = "0.01", message = "年利率必须大于0")
    @DecimalMax(value = "100", message = "年利率不能超过100%")
    private BigDecimal rate;
    
    @NotNull(message = "最小金额不能为空")
    @DecimalMin(value = "0.01", message = "最小金额必须大于0")
    private BigDecimal minAmount;
    
    @NotNull(message = "最大金额不能为空")
    @DecimalMin(value = "0.01", message = "最大金额必须大于0")
    private BigDecimal maxAmount;
    
    @NotNull(message = "期限不能为空")
    @Min(value = 1, message = "期限至少1个月")
    @Max(value = 120, message = "期限不能超过120个月")
    private Integer termMonths;
    
    private String description;
}

