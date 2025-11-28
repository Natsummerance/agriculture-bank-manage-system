package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCoupon {
    @Id
    private String id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(name = "coupon_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CouponType couponType;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;
    
    @Column(name = "min_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minAmount = BigDecimal.ZERO;
    
    @Column(name = "total_count", nullable = false)
    private Integer totalCount;
    
    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;
    
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;
    
    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;
    
    @Column(name = "target_role", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TargetRole targetRole = TargetRole.ALL;
    
    @Builder.Default
    private Boolean enabled = true;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum CouponType {
        DISCOUNT, CASH
    }
    
    public enum TargetRole {
        ALL, BUYER, FARMER
    }
}



