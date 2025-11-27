package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 买家收货地址实体
 */
@Entity
@Table(name = "buyer_addresses", indexes = {
    @Index(name = "idx_buyer_id", columnList = "buyerId"),
    @Index(name = "idx_is_default", columnList = "isDefault")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, length = 36)
    private String buyerId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 20)
    private String phone;
    
    @Column(nullable = false, length = 200)
    private String province;
    
    @Column(nullable = false, length = 200)
    private String city;
    
    @Column(nullable = false, length = 200)
    private String district;
    
    @Column(nullable = false, length = 500)
    private String detail;
    
    @Column(length = 10)
    private String postalCode;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}


