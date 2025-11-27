package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_gray_releases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminGrayRelease {
    @Id
    private String id;
    
    @Column(name = "feature_name", nullable = false, length = 200)
    private String featureName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "release_percent", nullable = false)
    @Builder.Default
    private Integer releasePercent = 0;
    
    @Column(name = "target_users", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TargetUsers targetUsers = TargetUsers.ALL;
    
    @Builder.Default
    private Boolean enabled = false;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
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
    
    public enum TargetUsers {
        ALL, NEW, VIP
    }
}



