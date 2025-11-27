package com.agriverse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * 退款历史记录实体
 */
@Entity
@Table(name = "refund_histories", indexes = {
    @Index(name = "idx_order_id", columnList = "orderId"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 36)
    private String orderId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ActorType actor;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 操作者类型枚举
     */
    public enum ActorType {
        BUYER("买家"),
        FARMER("农户"),
        ADMIN("管理员");

        private final String displayName;

        ActorType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}



