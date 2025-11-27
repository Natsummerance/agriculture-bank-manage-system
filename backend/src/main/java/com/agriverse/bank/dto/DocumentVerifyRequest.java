package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 资料审核请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentVerifyRequest {
    @NotBlank(message = "资料ID不能为空")
    private String documentId;
    
    @NotBlank(message = "审核结果不能为空")
    private String verifyStatus; // APPROVED, REJECTED
    
    private String verifyComment; // 审核意见
}



