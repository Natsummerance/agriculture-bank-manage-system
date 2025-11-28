package com.agriverse.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_operation_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOperationLog {
    @Id
    private String id;
    
    @Column(name = "operator_id", nullable = false, length = 36)
    private String operatorId;
    
    @Column(name = "operator_name", length = 100)
    private String operatorName;
    
    @Column(name = "operator_role", length = 20)
    private String operatorRole;
    
    @Column(name = "action_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;
    
    @Column(name = "action_detail", length = 500)
    private String actionDetail;
    
    @Column(name = "target_type", length = 50)
    @Enumerated(EnumType.STRING)
    private TargetType targetType;
    
    @Column(name = "target_id", length = 36)
    private String targetId;
    
    @Column(name = "target_name", length = 200)
    private String targetName;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OperationResult result = OperationResult.SUCCESS;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "ip_address", length = 50)
    private String ipAddress;
    
    @Column(name = "user_agent", length = 500)
    private String userAgent;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum ActionType {
        PRODUCT_AUDIT,      // 商品审核
        CONTENT_AUDIT,      // 内容审核
        EXPERT_AUDIT,       // 专家审核
        USER_MANAGE,        // 用户管理
        PERMISSION_MANAGE,  // 权限管理
        SYSTEM_CONFIG,      // 系统配置
        BANNER_MANAGE,      // 轮播图管理
        COUPON_MANAGE,      // 优惠券管理
        GRAY_RELEASE        // 灰度发布
    }
    
    public enum TargetType {
        PRODUCT, CONTENT, EXPERT, USER, CONFIG, BANNER, COUPON, FEATURE
    }
    
    public enum OperationResult {
        SUCCESS, FAILED
    }
}



