package com.agriverse.finance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 提前还款试算请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarlyRepaymentCalculateRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotNull(message = "提前还款金额不能为空")
    @DecimalMin(value = "0.01", message = "还款金额必须大于0")
    private BigDecimal amount;
    
    @NotNull(message = "提前还款日期不能为空")
    private LocalDate repaymentDate;
}

