package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 放款记录实体
 */
@Entity
@Table(name = "disbursements", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_disbursed_at", columnList = "disbursed_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Disbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "contract_id", length = 36)
    private String contractId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "bank_account", length = 50)
    private String bankAccount;
    
    @Column(name = "farmer_account", length = 50)
    private String farmerAccount;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DisbursementStatus status = DisbursementStatus.PENDING;
    
    @Column(name = "disbursed_by", length = 36)
    private String disbursedBy;
    
    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;
    
    @Column(columnDefinition = "TEXT")
    private String remark;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 放款状态枚举
     */
    public enum DisbursementStatus {
        PENDING,  // 待放款
        SUCCESS,  // 放款成功
        FAILED    // 放款失败
    }
}

