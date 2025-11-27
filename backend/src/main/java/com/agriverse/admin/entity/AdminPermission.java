package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 权限实体
 */
@Entity
@Table(name = "admin_permissions", indexes = {
    @Index(name = "idx_role", columnList = "role"),
    @Index(name = "idx_resource", columnList = "resource")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 50)
    private String role; // FARMER, BUYER, BANK, EXPERT, ADMIN

    @Column(nullable = false, length = 100)
    private String resource; // 资源标识，如：order:read, user:write

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PermissionAction action; // READ, WRITE, DELETE, EXECUTE

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 权限操作类型枚举
     */
    public enum PermissionAction {
        READ("读取"),
        WRITE("写入"),
        DELETE("删除"),
        EXECUTE("执行");

        private final String displayName;

        PermissionAction(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}



