package com.agriverse.bank.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 放款请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "合同ID不能为空")
    private String contractId;
    
    @NotNull(message = "放款金额不能为空")
    @DecimalMin(value = "0.01", message = "放款金额必须大于0")
    private BigDecimal amount;
    
    private String bankAccount; // 银行账户
    private String farmerAccount; // 农户账户
    private String remark; // 备注
}

