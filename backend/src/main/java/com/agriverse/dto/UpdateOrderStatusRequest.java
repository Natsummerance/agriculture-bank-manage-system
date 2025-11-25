package com.agriverse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 更新订单状态请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "订单状态不能为空")
    private String status;
}
