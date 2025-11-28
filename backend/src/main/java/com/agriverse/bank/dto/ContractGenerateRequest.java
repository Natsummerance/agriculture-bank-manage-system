package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 合同生成请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractGenerateRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    private String bankName; // 银行名称
    private String bankAccount; // 银行账户
}

