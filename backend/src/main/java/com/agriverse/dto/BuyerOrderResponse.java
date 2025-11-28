package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 买家订单响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerOrderResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String buyerId;
    private String status;
    private Double totalAmount;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String paymentMethod;
    private String refundStatus;
    private String refundReason;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * 订单项响应DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse implements Serializable {
        private static final long serialVersionUID = 1L;

        private String id;
        private String productId;
        private String productName;
        private Double price;
        private Integer quantity;
        private String productImage;
    }
}
