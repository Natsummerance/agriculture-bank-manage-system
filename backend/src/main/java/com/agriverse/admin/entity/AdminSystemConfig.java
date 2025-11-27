package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSystemConfig {
    @Id
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
    
    public enum ConfigType {
        STRING, NUMBER, BOOLEAN, JSON
    }
}



