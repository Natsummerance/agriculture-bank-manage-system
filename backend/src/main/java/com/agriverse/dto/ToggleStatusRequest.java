package com.agriverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 商品上下架请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToggleStatusRequest {
    @NotBlank(message = "商品ID不能为空")
    private String productId;

    @NotBlank(message = "状态不能为空")
    @Pattern(regexp = "on|off", message = "状态只能是on或off")
    private String status; // "on" 或 "off"
}
