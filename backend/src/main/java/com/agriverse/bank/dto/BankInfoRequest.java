package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 银行信息请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankInfoRequest {
    @NotBlank(message = "银行代码不能为空")
    private String bankCode;
    
    @NotBlank(message = "银行名称不能为空")
    private String bankName;
    
    private String bankType;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private String address;
    private String description;
    private String logoUrl;
}



