package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 银行客户关系实体
 */
@Entity
@Table(name = "bank_customer_relations", indexes = {
    @Index(name = "idx_bank_id", columnList = "bank_id"),
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_customer_name", columnList = "customer_name"),
    @Index(name = "idx_customer_phone", columnList = "customer_phone")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankCustomerRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "bank_id", nullable = false, length = 36)
    private String bankId;
    
    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;
    
    @Column(name = "customer_name", length = 100)
    private String customerName;
    
    @Column(name = "customer_phone", length = 20)
    private String customerPhone;
    
    @Column(name = "customer_location", length = 200)
    private String customerLocation;
    
    @Column(name = "customer_type", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CustomerType customerType = CustomerType.FARMER;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RelationStatus status = RelationStatus.ACTIVE;
    
    @Column(name = "total_loans")
    @Builder.Default
    private Integer totalLoans = 0;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(name = "current_loans")
    @Builder.Default
    private Integer currentLoans = 0;
    
    @Column(name = "current_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentAmount = BigDecimal.ZERO;
    
    @Column(length = 500)
    private String tags; // JSON格式
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "last_contact_at")
    private LocalDateTime lastContactAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum CustomerType {
        FARMER, ENTERPRISE
    }
    
    public enum RelationStatus {
        ACTIVE, INACTIVE, BLACKLIST
    }
}



