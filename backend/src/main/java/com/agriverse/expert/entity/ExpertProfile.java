package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 专家信息实体
 */
@Entity
@Table(name = "expert_profiles", indexes = {
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_rating", columnList = "rating")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "expert_id", nullable = false, unique = true, length = 36)
    private String expertId;
    
    @Column(length = 200)
    private String specialty;
    
    @Column(length = 500)
    private String qualification;
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    @Column(name = "service_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal servicePrice = BigDecimal.ZERO;
    
    @Column(name = "qa_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal qaPrice = BigDecimal.ZERO;
    
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;
    
    @Column(name = "total_consultations")
    @Builder.Default
    private Integer totalConsultations = 0;
    
    @Column(name = "total_income", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalIncome = BigDecimal.ZERO;
    
    @Column(name = "withdrawable_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal withdrawableBalance = BigDecimal.ZERO;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExpertStatus status = ExpertStatus.PENDING;
    
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
    
    public enum ExpertStatus {
        PENDING, APPROVED, REJECTED
    }
}



