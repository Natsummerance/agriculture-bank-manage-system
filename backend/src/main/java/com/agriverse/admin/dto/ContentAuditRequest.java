package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentAuditRequest {
    @NotBlank(message = "内容ID不能为空")
    private String contentId;
    
    @NotBlank(message = "审核结果不能为空")
    private String auditStatus; // APPROVED, REJECTED
    
    private String auditComment; // 审核意见
}



