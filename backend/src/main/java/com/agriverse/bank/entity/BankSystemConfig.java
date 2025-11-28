package com.agriverse.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 银行系统配置实体
 */
@Entity
@Table(name = "bank_system_config", indexes = {
    @Index(name = "idx_config_key", columnList = "config_key", unique = true),
    @Index(name = "idx_category", columnList = "category")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankSystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;
    
    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;
    
    @Column(name = "config_type", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ConfigType configType = ConfigType.STRING;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 50)
    private String category;
    
    @Column(name = "is_editable")
    @Builder.Default
    private Boolean isEditable = true;
    
    @Column(name = "updated_by", length = 36)
    private String updatedBy;
    
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
    
    public enum ConfigType {
        STRING, NUMBER, BOOLEAN, JSON
    }
}



