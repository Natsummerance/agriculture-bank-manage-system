package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * 客户联系记录实体
 */
@Entity
@Table(name = "customer_contact_records", indexes = {
    @Index(name = "idx_customer_relation_id", columnList = "customer_relation_id"),
    @Index(name = "idx_contact_date", columnList = "contact_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerContactRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "customer_relation_id", nullable = false, length = 36)
    private String customerRelationId;
    
    @Column(name = "contact_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContactType contactType;
    
    @Column(name = "contact_date", nullable = false)
    private LocalDateTime contactDate;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "contact_content", columnDefinition = "TEXT")
    private String contactContent;
    
    @Column(name = "next_followup_date")
    private LocalDateTime nextFollowupDate;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    public enum ContactType {
        PHONE, EMAIL, VISIT, MEETING
    }
}



