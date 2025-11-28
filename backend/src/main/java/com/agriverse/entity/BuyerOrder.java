package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 买家订单实体
 */
@Entity
@Table(name = "buyer_orders", indexes = {
        @Index(name = "idx_buyer_id", columnList = "buyerId"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 100)
    private String buyerId;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(length = 100)
    private String shippingName;

    @Column(length = 20)
    private String shippingPhone;

    @Column(length = 500)
    private String shippingAddress;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;

    @Column(columnDefinition = "TEXT")
    private String refundReason;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BuyerOrderItem> items = new ArrayList<>();

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
        TO_SHIP("待发货"),
        SHIPPED("已发货"),
        COMPLETED("已完成"),
        REFUNDING("退款中"),
        REFUNDED("已退款"),
        CANCELLED("已取消");

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
        PENDING("待卖家处理"),
        APPROVED("卖家已同意"),
        REJECTED("卖家已拒绝"),
        ESCALATED("已申请平台仲裁"),
        SUCCESS("平台已判定退款成功"),
        FAILED("平台已判定退款失败");

        private final String displayName;

        RefundStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
