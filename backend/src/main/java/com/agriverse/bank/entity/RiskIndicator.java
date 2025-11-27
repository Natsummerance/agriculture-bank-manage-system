package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 风险指标实体
 */
@Entity
@Table(name = "risk_indicators", indexes = {
    @Index(name = "idx_indicator_date", columnList = "indicator_date", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskIndicator {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "indicator_date", nullable = false, unique = true)
    private LocalDate indicatorDate;
    
    @Column(name = "overdue_rate", precision = 5, scale = 2)
    private BigDecimal overdueRate;
    
    @Column(name = "bad_debt_rate", precision = 5, scale = 2)
    private BigDecimal badDebtRate;
    
    @Column(name = "credit_balance", precision = 15, scale = 2)
    private BigDecimal creditBalance;
    
    @Column(name = "joint_loan_ratio", precision = 5, scale = 2)
    private BigDecimal jointLoanRatio;
    
    @Column(name = "total_loans")
    private Integer totalLoans;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "overdue_loans")
    private Integer overdueLoans;
    
    @Column(name = "overdue_amount", precision = 15, scale = 2)
    private BigDecimal overdueAmount;
    
    @Column(name = "bad_debt_loans")
    private Integer badDebtLoans;
    
    @Column(name = "bad_debt_amount", precision = 15, scale = 2)
    private BigDecimal badDebtAmount;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}



