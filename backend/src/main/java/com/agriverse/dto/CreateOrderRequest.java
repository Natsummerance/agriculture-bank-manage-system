package com.agriverse.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 创建订单请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotEmpty(message = "订单项不能为空")
    @Valid
    private List<OrderItemRequest> items;

    @NotBlank(message = "收货人姓名不能为空")
    private String shippingName;

    @NotBlank(message = "收货人手机号不能为空")
    private String shippingPhone;

    @NotBlank(message = "收货地址不能为空")
    private String shippingAddress;

    @NotBlank(message = "支付方式不能为空")
    private String paymentMethod;

    /**
     * 订单项请求DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest implements Serializable {
        private static final long serialVersionUID = 1L;

        @NotBlank(message = "商品ID不能为空")
        private String productId;

        @Min(value = 1, message = "购买数量必须大于0")
        private Integer quantity;
    }
}
