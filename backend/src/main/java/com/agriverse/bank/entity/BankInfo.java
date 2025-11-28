package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 银行信息实体
 */
@Entity
@Table(name = "bank_info", indexes = {
    @Index(name = "idx_bank_code", columnList = "bank_code", unique = true),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "bank_code", nullable = false, unique = true, length = 50)
    private String bankCode;
    
    @Column(name = "bank_name", nullable = false, length = 200)
    private String bankName;
    
    @Column(name = "bank_type", length = 20)
    @Enumerated(EnumType.STRING)
    private BankType bankType;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;
    
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(length = 500)
    private String address;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BankStatus status = BankStatus.ACTIVE;
    
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
    
    public enum BankType {
        COMMERCIAL, AGRICULTURAL, POLICY
    }
    
    public enum BankStatus {
        ACTIVE, INACTIVE
    }
}



