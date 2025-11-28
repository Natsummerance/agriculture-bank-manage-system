package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 对账记录实体
 */
@Entity
@Table(name = "reconciliation_records", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_reconciliation_date", columnList = "reconciliation_date"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "reconciliation_date", nullable = false)
    private LocalDate reconciliationDate;
    
    @Column(name = "disbursed_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal disbursedAmount;
    
    @Column(name = "repaid_principal", nullable = false, precision = 15, scale = 2)
    private BigDecimal repaidPrincipal;
    
    @Column(name = "repaid_interest", nullable = false, precision = 15, scale = 2)
    private BigDecimal repaidInterest;
    
    @Column(name = "pending_principal", nullable = false, precision = 15, scale = 2)
    private BigDecimal pendingPrincipal;
    
    @Column(name = "pending_interest", nullable = false, precision = 15, scale = 2)
    private BigDecimal pendingInterest;
    
    @Column(name = "overdue_principal", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal overduePrincipal = BigDecimal.ZERO;
    
    @Column(name = "overdue_interest", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal overdueInterest = BigDecimal.ZERO;
    
    @Column(name = "overdue_penalty", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal overduePenalty = BigDecimal.ZERO;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReconciliationStatus status = ReconciliationStatus.NORMAL;
    
    @Column(name = "difference_amount", precision = 15, scale = 2)
    private BigDecimal differenceAmount;
    
    @Column(name = "difference_reason", columnDefinition = "TEXT")
    private String differenceReason;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 对账状态枚举
     */
    public enum ReconciliationStatus {
        NORMAL,      // 正常
        DIFFERENCE,  // 有差异
        RESOLVED     // 已处理
    }
}



