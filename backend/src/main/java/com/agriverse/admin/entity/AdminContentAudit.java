package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_content_audits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminContentAudit {
    @Id
    private String id;
    
    @Column(name = "content_id", nullable = false, length = 36)
    private String contentId;
    
    @Column(name = "content_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Column(name = "content_title", length = 200)
    private String contentTitle;
    
    @Column(name = "author_id", nullable = false, length = 36)
    private String authorId;
    
    @Column(name = "author_name", length = 100)
    private String authorName;
    
    @Column(name = "audit_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "audit_comment", columnDefinition = "TEXT")
    private String auditComment;
    
    @Column(name = "audited_by", length = 36)
    private String auditedBy;
    
    @Column(name = "audited_at")
    private LocalDateTime auditedAt;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ContentType {
        ARTICLE, VIDEO, IMAGE, QA
    }
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}



