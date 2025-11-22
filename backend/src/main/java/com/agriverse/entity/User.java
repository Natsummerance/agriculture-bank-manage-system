package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_phone", columnList = "phone", unique = true),
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_role", columnList = "role")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String name;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(length = 255)
    private String avatar;

    @Column(length = 100)
    private String company;

    @Column(length = 200)
    private String location;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer loginAttempts = 0;

    @Column
    private LocalDateTime lastLoginTime;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 用户角色枚举
     */
    public enum UserRole {
        FARMER("农户"),
        BUYER("买家"),
        BANK("银行"),
        EXPERT("专家"),
        ADMIN("管理员");

        private final String displayName;

        UserRole(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
