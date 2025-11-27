package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 申请资料实体
 */
@Entity
@Table(name = "application_documents", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_document_type", columnList = "document_type"),
    @Index(name = "idx_verify_status", columnList = "verify_status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "document_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    
    @Column(name = "document_name", nullable = false, length = 200)
    private String documentName;
    
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type", length = 50)
    private String fileType;
    
    @Column(name = "upload_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UploadStatus uploadStatus = UploadStatus.UPLOADED;
    
    @Column(name = "verify_status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerifyStatus verifyStatus = VerifyStatus.PENDING;
    
    @Column(name = "verify_comment", columnDefinition = "TEXT")
    private String verifyComment;
    
    @Column(name = "verified_by", length = 36)
    private String verifiedBy;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "uploaded_by", length = 36)
    private String uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
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
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum DocumentType {
        ID_CARD,           // 身份证
        BUSINESS_LICENSE,  // 营业执照
        FINANCIAL_STATEMENT, // 财务报表
        LAND_CONTRACT,     // 土地合同
        BANK_STATEMENT,    // 银行流水
        OTHER              // 其他
    }
    
    public enum UploadStatus {
        UPLOADED, VERIFIED, REJECTED
    }
    
    public enum VerifyStatus {
        PENDING, APPROVED, REJECTED
    }
}



