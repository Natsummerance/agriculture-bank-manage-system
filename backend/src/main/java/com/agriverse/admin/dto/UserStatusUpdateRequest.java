package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusUpdateRequest {
    @NotBlank(message = "用户ID不能为空")
    private String userId;
    
    @NotBlank(message = "状态不能为空")
    private String status; // ACTIVE, DISABLED
}



