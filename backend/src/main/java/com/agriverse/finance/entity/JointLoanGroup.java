package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 智能拼单组实体
 */
@Entity
@Table(name = "joint_loan_groups", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JointLoanGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "group_name", length = 200)
    private String groupName;
    
    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "min_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal minAmount;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GroupStatus status = GroupStatus.MATCHING;
    
    @Column(name = "matched_count")
    @Builder.Default
    private Integer matchedCount = 0;
    
    @Column(name = "target_count")
    private Integer targetCount;
    
    @Column(name = "created_by", nullable = false, length = 36)
    private String createdBy;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 拼单组状态枚举
     */
    public enum GroupStatus {
        MATCHING,   // 匹配中
        MATCHED,    // 已匹配
        APPLIED,    // 已申请
        CANCELLED   // 已取消
    }
}

