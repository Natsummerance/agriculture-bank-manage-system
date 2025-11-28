package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 答案实体
 */
@Entity
@Table(name = "expert_answers", indexes = {
    @Index(name = "idx_question_id", columnList = "questionId"),
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_is_adopted", columnList = "isAdopted")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "question_id", nullable = false, length = 36)
    private String questionId;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "expert_name", length = 100)
    private String expertName;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "is_adopted")
    @Builder.Default
    private Boolean isAdopted = false;
    
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal reward = BigDecimal.ZERO;
    
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
}



