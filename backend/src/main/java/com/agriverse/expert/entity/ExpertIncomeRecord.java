package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 专家收入记录实体
 */
@Entity
@Table(name = "expert_income_records", indexes = {
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_income_type", columnList = "incomeType"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertIncomeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "income_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private IncomeType incomeType;
    
    @Column(name = "source_id", length = 36)
    private String sourceId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncomeStatus status = IncomeStatus.PENDING;
    
    @Column(name = "settled_at")
    private LocalDateTime settledAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    public enum IncomeType {
        QA, APPOINTMENT, ADOPTION
    }
    
    public enum IncomeStatus {
        PENDING, SETTLED, CANCELLED
    }
}



