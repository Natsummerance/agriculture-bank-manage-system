package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 */
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_buyer_id", columnList = "buyerId"),
    @Index(name = "idx_farmer_id", columnList = "farmerId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 36)
    private String buyerId;

    @Column(nullable = false, length = 36)
    private String farmerId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(length = 500)
    private String shippingAddress;

    @Column(length = 20)
    private String shippingPhone;

    @Column(length = 100)
    private String shippingName;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;

    @Column(columnDefinition = "TEXT")
    private String refundReason;

    @Column(length = 100)
    private String trackingNumber;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 订单状态枚举
     */
    public enum OrderStatus {
        PENDING("待支付"),
        PAID("已支付"),
        SHIPPED("已发货"),
        COMPLETED("已完成"),
        CANCELLED("已取消"),
        REFUNDING("退款中"),
        REFUNDED("已退款");

        private final String displayName;

        OrderStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * 退款状态枚举
     */
    public enum RefundStatus {
        PENDING("待处理"),
        APPROVED("已同意"),
        REJECTED("已拒绝"),
        ESCALATED("已升级仲裁"),
        SUCCESS("退款成功"),
        FAILED("退款失败");

        private final String displayName;

        RefundStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}



