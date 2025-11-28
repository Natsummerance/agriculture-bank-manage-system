package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundArbitrationRequest {
    @NotBlank(message = "订单ID不能为空")
    private String orderId;
    
    @NotBlank(message = "仲裁结果不能为空")
    private String result; // SUCCESS, FAILED
    
    private String note; // 仲裁说明
}



