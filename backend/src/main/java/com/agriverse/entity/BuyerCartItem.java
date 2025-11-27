package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 买家购物车商品实体
 */
@Entity
@Table(name = "buyer_cart_items", indexes = {
    @Index(name = "idx_buyer_id", columnList = "buyerId"),
    @Index(name = "idx_product_id", columnList = "productId"),
    @Index(name = "idx_buyer_product", columnList = "buyerId,productId", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerCartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, length = 36)
    private String buyerId;
    
    @Column(nullable = false, length = 36)
    private String productId;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean selected = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}


