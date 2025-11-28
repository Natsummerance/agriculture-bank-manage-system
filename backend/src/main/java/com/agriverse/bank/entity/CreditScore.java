package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 信用评分实体
 */
@Entity
@Table(name = "credit_scores", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_farmer_id", columnList = "farmer_id"),
    @Index(name = "idx_total_score", columnList = "total_score")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "credit_history_score")
    private Integer creditHistoryScore;
    
    @Column(name = "income_score")
    private Integer incomeScore;
    
    @Column(name = "asset_score")
    private Integer assetScore;
    
    @Column(name = "debt_ratio_score")
    private Integer debtRatioScore;
    
    @Column(name = "experience_score")
    private Integer experienceScore;
    
    @Column(name = "total_score", nullable = false)
    private Integer totalScore;
    
    @Column(name = "risk_level", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    @Column(name = "suggested_amount", precision = 15, scale = 2)
    private BigDecimal suggestedAmount;
    
    @Column(name = "reviewer_id", length = 36)
    private String reviewerId;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 风险等级枚举
     */
    public enum RiskLevel {
        LOW,     // 低风险
        MEDIUM,  // 中风险
        HIGH     // 高风险
    }
}

