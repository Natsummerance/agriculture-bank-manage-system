package com.agriverse.bank.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 信用评分请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditScoreRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @Min(value = 0, message = "信用历史评分不能小于0")
    @Max(value = 100, message = "信用历史评分不能超过100")
    private Integer creditHistoryScore;
    
    @NotNull(message = "年收入不能为空")
    @DecimalMin(value = "0", message = "年收入不能小于0")
    private BigDecimal income;
    
    @NotNull(message = "资产总额不能为空")
    @DecimalMin(value = "0", message = "资产总额不能小于0")
    private BigDecimal assets;
    
    @Min(value = 0, message = "负债率不能小于0")
    @Max(value = 100, message = "负债率不能超过100")
    private Integer debtRatio;
    
    @Min(value = 0, message = "行业经验评分不能小于0")
    @Max(value = 100, message = "行业经验评分不能超过100")
    private Integer industryExperience;
}

