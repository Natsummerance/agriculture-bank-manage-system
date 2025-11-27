package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * 融资时间线实体
 */
@Entity
@Table(name = "financing_timeline", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancingTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ActorType actor;
    
    @Column(name = "actor_id", length = 36)
    private String actorId;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 操作人类型枚举
     */
    public enum ActorType {
        FARMER,  // 农户
        BANK,    // 银行
        ADMIN    // 管理员
    }
}

