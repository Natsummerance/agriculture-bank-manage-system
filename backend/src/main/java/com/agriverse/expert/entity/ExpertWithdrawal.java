package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 专家提现记录实体
 */
@Entity
@Table(name = "expert_withdrawals", indexes = {
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertWithdrawal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "bank_account", length = 50)
    private String bankAccount;
    
    @Column(name = "account_name", length = 100)
    private String accountName;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WithdrawalStatus status = WithdrawalStatus.PENDING;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(columnDefinition = "TEXT")
    private String remark;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
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
    
    public enum WithdrawalStatus {
        PENDING, PROCESSING, SUCCESS, FAILED
    }
}



