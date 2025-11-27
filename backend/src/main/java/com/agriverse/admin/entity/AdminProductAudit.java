package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_product_audits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductAudit {
    @Id
    private String id;
    
    @Column(name = "product_id", nullable = false, length = 36)
    private String productId;
    
    @Column(name = "product_name", length = 200)
    private String productName;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
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
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}



