package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 还款记录实体
 */
@Entity
@Table(name = "repayment_records", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_schedule_id", columnList = "schedule_id"),
    @Index(name = "idx_paid_at", columnList = "paid_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "schedule_id", length = 36)
    private String scheduleId;
    
    @Column(name = "repayment_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RepaymentType repaymentType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal interest;
    
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal penalty = BigDecimal.ZERO;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 还款类型枚举
     */
    public enum RepaymentType {
        NORMAL,  // 正常还款
        EARLY,   // 提前还款
        OVERDUE  // 逾期还款
    }
}

