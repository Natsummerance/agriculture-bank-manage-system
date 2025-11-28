package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 拼单成员实体
 */
@Entity
@Table(name = "joint_loan_members", indexes = {
    @Index(name = "idx_group_id", columnList = "group_id"),
    @Index(name = "idx_farmer_id", columnList = "farmer_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JointLoanMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "group_id", nullable = false, length = 36)
    private String groupId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 500)
    private String purpose;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MemberStatus status = MemberStatus.PENDING;
    
    @Column(name = "financing_id", length = 36)
    private String financingId;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 成员状态枚举
     */
    public enum MemberStatus {
        PENDING,    // 待确认
        CONFIRMED,  // 已确认
        CANCELLED   // 已取消
    }
}

