package com.agriverse.bank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 客户联系请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerContactRequest {
    @NotBlank(message = "客户关系ID不能为空")
    private String customerRelationId;
    
    @NotBlank(message = "联系类型不能为空")
    private String contactType; // PHONE, EMAIL, VISIT, MEETING
    
    @NotNull(message = "联系日期不能为空")
    private LocalDateTime contactDate;
    
    private String contactPerson;
    
    @NotBlank(message = "联系内容不能为空")
    private String contactContent;
    
    private LocalDateTime nextFollowupDate;
}



