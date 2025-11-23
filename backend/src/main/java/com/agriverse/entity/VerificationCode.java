package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 验证码实体
 */
@Entity
@Table(name = "verification_codes", indexes = {
        @Index(name = "idx_phone_type", columnList = "phone,type"),
        @Index(name = "idx_expired_at", columnList = "expiredAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCode {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CodeType type;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer attempts = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 验证码类型
     */
    public enum CodeType {
        REGISTER("注册"),
        LOGIN("登录"),
        RESET("重置密码");

        private final String displayName;

        CodeType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * 检查验证码是否过期
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiredAt);
    }

    /**
     * 检查验证码是否有效
     */
    public boolean isValid() {
        return !used && !isExpired();
    }
}
