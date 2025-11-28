package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 融资申请实体
 */
@Entity
@Table(name = "financing_applications", indexes = {
    @Index(name = "idx_farmer_id", columnList = "farmer_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_product_id", columnList = "product_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "product_id", length = 36)
    private String productId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;
    
    @Column(nullable = false, length = 500)
    private String purpose;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FinancingStatus status = FinancingStatus.APPLIED;
    
    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    @Column(name = "credit_score")
    private Integer creditScore;
    
    @Column(name = "reviewer_id", length = 36)
    private String reviewerId;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "review_comment", columnDefinition = "TEXT")
    private String reviewComment;
    
    @Column(name = "contract_id", length = 36)
    private String contractId;
    
    @Column(name = "signed_at")
    private LocalDateTime signedAt;
    
    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;
    
    @Column(name = "disbursed_amount", precision = 15, scale = 2)
    private BigDecimal disbursedAmount;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 融资状态枚举
     */
    public enum FinancingStatus {
        APPLIED,      // 已申请
        REVIEWING,    // 审批中
        APPROVED,     // 已通过
        REJECTED,     // 已拒绝
        SIGNED,       // 已签约
        DISBURSED,    // 已放款
        REPAYING,     // 还款中
        SETTLED       // 已结清
    }
}

