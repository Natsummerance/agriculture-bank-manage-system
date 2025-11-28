package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 资料上传请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentUploadRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "资料类型不能为空")
    private String documentType;
    
    @NotBlank(message = "资料名称不能为空")
    private String documentName;
    
    @NotBlank(message = "文件URL不能为空")
    private String fileUrl;
    
    private Long fileSize;
    private String fileType;
}



