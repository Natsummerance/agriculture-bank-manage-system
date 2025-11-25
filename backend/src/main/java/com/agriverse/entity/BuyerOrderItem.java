package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 买家订单项实体
 */
@Entity
@Table(name = "buyer_order_items", indexes = {
        @Index(name = "idx_order_id", columnList = "orderId"),
        @Index(name = "idx_product_id", columnList = "productId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", nullable = false)
    private BuyerOrder order;

    @Column(nullable = false, length = 100)
    private String productId;

    @Column(nullable = false, length = 200)
    private String productName;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 500)
    private String productImage;
}
