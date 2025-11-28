package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 专家内容实体
 */
@Entity
@Table(name = "expert_contents", indexes = {
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_content_type", columnList = "contentType"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_audit_status", columnList = "auditStatus"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertContent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "content_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 500)
    private String summary;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    
    @Column(name = "video_url", length = 500)
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String images; // JSON格式
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(name = "like_count")
    @Builder.Default
    private Integer likeCount = 0;
    
    @Column(name = "comment_count")
    @Builder.Default
    private Integer commentCount = 0;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContentStatus status = ContentStatus.DRAFT;
    
    @Column(name = "audit_status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
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
    
    public enum ContentType {
        ARTICLE, VIDEO, IMAGE
    }
    
    public enum ContentStatus {
        DRAFT, PUBLISHED, OFFLINE
    }
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}



