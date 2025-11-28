package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 银行账户请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountRequest {
    @NotBlank(message = "银行ID不能为空")
    private String bankId;
    
    @NotBlank(message = "账户号码不能为空")
    private String accountNumber;
    
    @NotBlank(message = "账户名称不能为空")
    private String accountName;
    
    @NotBlank(message = "账户类型不能为空")
    private String accountType; // SETTLEMENT, OPERATION, RESERVE
    
    private String currency;
    private String remark;
}



