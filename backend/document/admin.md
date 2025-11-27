# 管理员模块后端实现流程文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 管理员功能管理

---

## 📋 目录

1. [功能概述](#1-功能概述)
2. [数据库设计](#2-数据库设计)
3. [实体类设计](#3-实体类设计)
4. [DTO设计](#4-dto设计)
5. [Repository层](#5-repository层)
6. [Service层](#6-service层)
7. [Controller层](#7-controller层)
8. [业务流程说明](#8-业务流程说明)
9. [API接口设计](#9-api接口设计)
10. [实现步骤](#10-实现步骤)

---

## 1. 功能概述

### 1.1 管理员仪表盘

1. **数据统计**
   - 今日PV/UV统计
   - 今日交易额统计
   - 今日订单数量
   - 待审核商品数量
   - 待审核内容数量
   - 在途融资数量

2. **趋势分析**
   - 订单趋势图表（近6个月）
   - 交易额趋势图表
   - 用户增长趋势

3. **快捷操作**
   - 快速跳转到审核列表
   - 快速跳转到订单监控
   - 快速跳转到用户管理

### 1.2 融资监控

1. **融资概览**
   - 融资申请总数统计
   - 待审批数量
   - 已批准数量
   - 融资总额统计
   - 还款中金额统计

2. **融资监控**
   - 融资申请列表查询
   - 融资状态筛选
   - 融资详情查看
   - 异常融资预警

### 1.3 专家管理

1. **专家审核**
   - 专家申请列表
   - 专家资质审核
   - 专家信息查看
   - 专家状态管理

2. **内容审核**
   - 文章审核
   - 视频审核
   - 问答审核
   - 内容状态管理

### 1.4 商品审核

1. **商品审核**
   - 待审核商品列表
   - 商品信息审核
   - 商品详情查看
   - 审核通过/拒绝

2. **商品管理**
   - 商品状态管理
   - 商品下架处理
   - 违规商品处理

### 1.5 订单监控

1. **订单统计**
   - 订单总数统计
   - 订单总额统计
   - 今日订单数量
   - 订单状态分布

2. **订单查询**
   - 订单列表查询
   - 订单状态筛选
   - 订单详情查看
   - 订单时间筛选

### 1.6 用户管理

1. **用户列表**
   - 用户列表查询
   - 用户搜索（姓名、电话）
   - 用户角色筛选
   - 用户状态管理

2. **用户操作**
   - 用户启用/禁用
   - 用户信息查看
   - 用户角色修改
   - 用户数据统计

### 1.7 系统配置

1. **基本配置**
   - 站点名称配置
   - 维护模式开关
   - 文件上传大小限制
   - 短信/邮件服务开关

2. **功能配置**
   - 系统功能开关
   - 业务规则配置
   - 通知配置
   - 缓存管理

### 1.8 操作日志

1. **日志查询**
   - 操作日志列表
   - 操作类型筛选
   - 操作时间筛选
   - 操作人筛选

2. **日志导出**
   - Excel导出
   - 日志统计分析
   - 异常操作预警

### 1.9 权限管理

1. **角色权限**
   - 角色列表管理
   - 权限配置
   - 权限分配
   - 权限验证

### 1.10 轮播图管理

1. **轮播图管理**
   - 轮播图列表
   - 轮播图添加/编辑
   - 轮播图删除
   - 轮播图排序
   - 轮播图启用/禁用

### 1.11 优惠券发放

1. **优惠券管理**
   - 优惠券列表
   - 优惠券创建
   - 优惠券编辑
   - 优惠券发放统计
   - 优惠券启用/禁用

### 1.12 灰度发布

1. **灰度功能管理**
   - 灰度功能列表
   - 灰度功能创建
   - 发布比例设置
   - 目标用户设置
   - 功能启用/禁用

### 1.13 退款仲裁

1. **退款纠纷处理**
   - 退款纠纷列表
   - 退款详情查看
   - 退款仲裁处理
   - 退款状态更新

---

## 2. 数据库设计

### 2.1 操作日志表 (admin_operation_logs)

```sql
CREATE TABLE IF NOT EXISTS admin_operation_logs (
    id VARCHAR(36) PRIMARY KEY COMMENT '日志ID',
    operator_id VARCHAR(36) NOT NULL COMMENT '操作人ID',
    operator_name VARCHAR(100) COMMENT '操作人姓名',
    operator_role VARCHAR(20) COMMENT '操作人角色',
    action_type VARCHAR(50) NOT NULL COMMENT '操作类型: PRODUCT_AUDIT-商品审核, CONTENT_AUDIT-内容审核, EXPERT_AUDIT-专家审核, USER_MANAGE-用户管理, PERMISSION_MANAGE-权限管理, SYSTEM_CONFIG-系统配置',
    action_detail VARCHAR(500) COMMENT '操作详情',
    target_type VARCHAR(50) COMMENT '目标类型: PRODUCT-商品, CONTENT-内容, EXPERT-专家, USER-用户, CONFIG-配置',
    target_id VARCHAR(36) COMMENT '目标ID',
    target_name VARCHAR(200) COMMENT '目标名称',
    result VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' COMMENT '操作结果: SUCCESS-成功, FAILED-失败',
    error_message TEXT COMMENT '错误信息',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_operator_id (operator_id),
    INDEX idx_action_type (action_type),
    INDEX idx_target_type (target_type),
    INDEX idx_created_at (created_at),
    INDEX idx_result (result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员操作日志表';
```

### 2.2 系统配置表 (admin_system_config)

```sql
CREATE TABLE IF NOT EXISTS admin_system_config (
    id VARCHAR(36) PRIMARY KEY COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type VARCHAR(20) DEFAULT 'STRING' COMMENT '配置类型: STRING-字符串, NUMBER-数字, BOOLEAN-布尔, JSON-JSON对象',
    description VARCHAR(500) COMMENT '配置描述',
    category VARCHAR(50) COMMENT '配置分类: BASIC-基本设置, FEATURE-功能开关, NOTIFICATION-通知, UPLOAD-上传, SECURITY-安全',
    is_editable BOOLEAN DEFAULT TRUE COMMENT '是否可编辑',
    updated_by VARCHAR(36) COMMENT '更新人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_config_key (config_key),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';
```

### 2.3 轮播图表 (admin_banners)

```sql
CREATE TABLE IF NOT EXISTS admin_banners (
    id VARCHAR(36) PRIMARY KEY COMMENT '轮播图ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
    link_url VARCHAR(500) COMMENT '跳转链接',
    display_order INT DEFAULT 0 COMMENT '显示顺序',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    click_count INT DEFAULT 0 COMMENT '点击次数',
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_enabled (enabled),
    INDEX idx_display_order (display_order),
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';
```

### 2.4 优惠券表 (admin_coupons)

```sql
CREATE TABLE IF NOT EXISTS admin_coupons (
    id VARCHAR(36) PRIMARY KEY COMMENT '优惠券ID',
    name VARCHAR(200) NOT NULL COMMENT '优惠券名称',
    coupon_type VARCHAR(20) NOT NULL COMMENT '优惠券类型: DISCOUNT-折扣券, CASH-现金券',
    value DECIMAL(10,2) NOT NULL COMMENT '优惠值（折扣为百分比，现金为金额）',
    min_amount DECIMAL(10,2) DEFAULT 0 COMMENT '最低使用金额',
    total_count INT NOT NULL COMMENT '发放总数',
    used_count INT DEFAULT 0 COMMENT '已使用数量',
    valid_from DATETIME NOT NULL COMMENT '有效期开始时间',
    valid_to DATETIME NOT NULL COMMENT '有效期结束时间',
    target_role VARCHAR(20) DEFAULT 'ALL' COMMENT '目标角色: ALL-全部, BUYER-买家, FARMER-农户',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    description TEXT COMMENT '优惠券描述',
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_enabled (enabled),
    INDEX idx_valid_from (valid_from),
    INDEX idx_valid_to (valid_to),
    INDEX idx_target_role (target_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';
```

### 2.5 灰度发布表 (admin_gray_releases)

```sql
CREATE TABLE IF NOT EXISTS admin_gray_releases (
    id VARCHAR(36) PRIMARY KEY COMMENT '灰度发布ID',
    feature_name VARCHAR(200) NOT NULL COMMENT '功能名称',
    description TEXT COMMENT '功能描述',
    release_percent INT NOT NULL DEFAULT 0 COMMENT '发布比例（0-100）',
    target_users VARCHAR(20) DEFAULT 'ALL' COMMENT '目标用户: ALL-全部, NEW-新用户, VIP-VIP用户',
    enabled BOOLEAN DEFAULT FALSE COMMENT '是否启用',
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_enabled (enabled),
    INDEX idx_feature_name (feature_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='灰度发布表';
```

### 2.6 商品审核记录表 (admin_product_audits)

```sql
CREATE TABLE IF NOT EXISTS admin_product_audits (
    id VARCHAR(36) PRIMARY KEY COMMENT '审核记录ID',
    product_id VARCHAR(36) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) COMMENT '商品名称',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    farmer_name VARCHAR(100) COMMENT '农户姓名',
    audit_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '审核状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    audit_comment TEXT COMMENT '审核意见',
    audited_by VARCHAR(36) COMMENT '审核人ID',
    audited_at DATETIME COMMENT '审核时间',
    submitted_at DATETIME NOT NULL COMMENT '提交时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_product_id (product_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_audit_status (audit_status),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (product_id) REFERENCES farmer_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品审核记录表';
```

### 2.7 内容审核记录表 (admin_content_audits)

```sql
CREATE TABLE IF NOT EXISTS admin_content_audits (
    id VARCHAR(36) PRIMARY KEY COMMENT '审核记录ID',
    content_id VARCHAR(36) NOT NULL COMMENT '内容ID',
    content_type VARCHAR(20) NOT NULL COMMENT '内容类型: ARTICLE-文章, VIDEO-视频, IMAGE-图片, QA-问答',
    content_title VARCHAR(200) COMMENT '内容标题',
    author_id VARCHAR(36) NOT NULL COMMENT '作者ID',
    author_name VARCHAR(100) COMMENT '作者姓名',
    audit_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '审核状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    audit_comment TEXT COMMENT '审核意见',
    audited_by VARCHAR(36) COMMENT '审核人ID',
    audited_at DATETIME COMMENT '审核时间',
    submitted_at DATETIME NOT NULL COMMENT '提交时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_content_id (content_id),
    INDEX idx_content_type (content_type),
    INDEX idx_author_id (author_id),
    INDEX idx_audit_status (audit_status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容审核记录表';
```

### 2.8 专家审核记录表 (admin_expert_audits)

```sql
CREATE TABLE IF NOT EXISTS admin_expert_audits (
    id VARCHAR(36) PRIMARY KEY COMMENT '审核记录ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    expert_name VARCHAR(100) COMMENT '专家姓名',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    specialty VARCHAR(200) COMMENT '专业领域',
    qualification VARCHAR(500) COMMENT '资质证明',
    experience TEXT COMMENT '经验描述',
    audit_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '审核状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    audit_comment TEXT COMMENT '审核意见',
    audited_by VARCHAR(36) COMMENT '审核人ID',
    audited_at DATETIME COMMENT '审核时间',
    submitted_at DATETIME NOT NULL COMMENT '提交时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_audit_status (audit_status),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家审核记录表';
```

---

## 3. 实体类设计

### 3.1 AdminOperationLog (操作日志)

**路径**: `com.agriverse.admin.entity.AdminOperationLog`

```java
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
```

### 3.2 AdminSystemConfig (系统配置)

**路径**: `com.agriverse.admin.entity.AdminSystemConfig`

```java
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
```

### 3.3 AdminBanner (轮播图)

**路径**: `com.agriverse.admin.entity.AdminBanner`

```java
@Entity
@Table(name = "admin_banners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBanner {
    @Id
    private String id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "link_url", length = 500)
    private String linkUrl;
    
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
    
    @Builder.Default
    private Boolean enabled = true;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "click_count")
    @Builder.Default
    private Integer clickCount = 0;
    
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
}
```

### 3.4 AdminCoupon (优惠券)

**路径**: `com.agriverse.admin.entity.AdminCoupon`

```java
@Entity
@Table(name = "admin_coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCoupon {
    @Id
    private String id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(name = "coupon_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CouponType couponType;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;
    
    @Column(name = "min_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minAmount = BigDecimal.ZERO;
    
    @Column(name = "total_count", nullable = false)
    private Integer totalCount;
    
    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;
    
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;
    
    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;
    
    @Column(name = "target_role", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TargetRole targetRole = TargetRole.ALL;
    
    @Builder.Default
    private Boolean enabled = true;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
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
    
    public enum CouponType {
        DISCOUNT, CASH
    }
    
    public enum TargetRole {
        ALL, BUYER, FARMER
    }
}
```

### 3.5 AdminGrayRelease (灰度发布)

**路径**: `com.agriverse.admin.entity.AdminGrayRelease`

```java
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
```

### 3.6 AdminProductAudit (商品审核记录)

**路径**: `com.agriverse.admin.entity.AdminProductAudit`

```java
@Entity
@Table(name = "admin_product_audits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductAudit {
    @Id
    private String id;
    
    @Column(name = "product_id", nullable = false, length = 36)
    private String productId;
    
    @Column(name = "product_name", length = 200)
    private String productName;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
    @Column(name = "audit_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "audit_comment", columnDefinition = "TEXT")
    private String auditComment;
    
    @Column(name = "audited_by", length = 36)
    private String auditedBy;
    
    @Column(name = "audited_at")
    private LocalDateTime auditedAt;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
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
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

### 3.7 AdminContentAudit (内容审核记录)

**路径**: `com.agriverse.admin.entity.AdminContentAudit`

```java
@Entity
@Table(name = "admin_content_audits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminContentAudit {
    @Id
    private String id;
    
    @Column(name = "content_id", nullable = false, length = 36)
    private String contentId;
    
    @Column(name = "content_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Column(name = "content_title", length = 200)
    private String contentTitle;
    
    @Column(name = "author_id", nullable = false, length = 36)
    private String authorId;
    
    @Column(name = "author_name", length = 100)
    private String authorName;
    
    @Column(name = "audit_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "audit_comment", columnDefinition = "TEXT")
    private String auditComment;
    
    @Column(name = "audited_by", length = 36)
    private String auditedBy;
    
    @Column(name = "audited_at")
    private LocalDateTime auditedAt;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
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
    
    public enum ContentType {
        ARTICLE, VIDEO, IMAGE, QA
    }
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

### 3.8 AdminExpertAudit (专家审核记录)

**路径**: `com.agriverse.admin.entity.AdminExpertAudit`

```java
@Entity
@Table(name = "admin_expert_audits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminExpertAudit {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "expert_name", length = 100)
    private String expertName;
    
    @Column(length = 20)
    private String phone;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 200)
    private String specialty;
    
    @Column(length = 500)
    private String qualification;
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    @Column(name = "audit_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "audit_comment", columnDefinition = "TEXT")
    private String auditComment;
    
    @Column(name = "audited_by", length = 36)
    private String auditedBy;
    
    @Column(name = "audited_at")
    private LocalDateTime auditedAt;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
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
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

---

## 4. DTO设计

### 4.1 仪表盘相关DTO

#### 4.1.1 AdminDashboardStatisticsResponse (仪表盘统计响应)

**路径**: `com.agriverse.admin.dto.AdminDashboardStatisticsResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatisticsResponse {
    private Long todayPV;              // 今日PV
    private Long totalPV;               // 累计PV
    private Long todayUV;              // 今日UV
    private Long totalUV;               // 累计UV
    private BigDecimal todayRevenue;   // 今日交易额
    private BigDecimal totalRevenue;   // 累计交易额
    private Integer todayOrders;        // 今日订单数
    private Integer totalOrders;        // 累计订单数
    private Integer pendingProducts;   // 待审核商品数
    private Integer pendingContent;    // 待审核内容数
    private Integer activeFinancing;   // 在途融资数
    private BigDecimal totalFinancingAmount; // 融资总额
    private List<TrendData> orderTrend;     // 订单趋势
    private List<TrendData> revenueTrend;   // 交易额趋势
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    private String name;   // 月份或日期
    private BigDecimal value; // 数值
}
```

### 4.2 融资监控相关DTO

#### 4.2.1 FinanceMonitorResponse (融资监控响应)

**路径**: `com.agriverse.admin.dto.FinanceMonitorResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceMonitorResponse {
    private Integer totalApplications;    // 融资申请总数
    private Integer pendingApprovals;     // 待审批数量
    private Integer approvedCount;        // 已批准数量
    private BigDecimal totalAmount;        // 融资总额
    private BigDecimal repayingAmount;    // 还款中金额
    private List<FinancingApplication> applications; // 融资申请列表
}
```

### 4.3 审核相关DTO

#### 4.3.1 ProductAuditRequest (商品审核请求)

**路径**: `com.agriverse.admin.dto.ProductAuditRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAuditRequest {
    @NotBlank(message = "商品ID不能为空")
    private String productId;
    
    @NotBlank(message = "审核结果不能为空")
    private String auditStatus; // APPROVED, REJECTED
    
    private String auditComment; // 审核意见
}
```

#### 4.3.2 ContentAuditRequest (内容审核请求)

**路径**: `com.agriverse.admin.dto.ContentAuditRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentAuditRequest {
    @NotBlank(message = "内容ID不能为空")
    private String contentId;
    
    @NotBlank(message = "审核结果不能为空")
    private String auditStatus; // APPROVED, REJECTED
    
    private String auditComment; // 审核意见
}
```

#### 4.3.3 ExpertAuditRequest (专家审核请求)

**路径**: `com.agriverse.admin.dto.ExpertAuditRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertAuditRequest {
    @NotBlank(message = "专家ID不能为空")
    private String expertId;
    
    @NotBlank(message = "审核结果不能为空")
    private String auditStatus; // APPROVED, REJECTED
    
    private String auditComment; // 审核意见
}
```

### 4.4 用户管理相关DTO

#### 4.4.1 UserSearchRequest (用户搜索请求)

**路径**: `com.agriverse.admin.dto.UserSearchRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchRequest {
    private String keyword;      // 搜索关键词（姓名、电话）
    private String role;          // 角色筛选
    private String status;        // 状态筛选
    private Integer page = 0;
    private Integer size = 20;
}
```

#### 4.4.2 UserStatusUpdateRequest (用户状态更新请求)

**路径**: `com.agriverse.admin.dto.UserStatusUpdateRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusUpdateRequest {
    @NotBlank(message = "用户ID不能为空")
    private String userId;
    
    @NotBlank(message = "状态不能为空")
    private String status; // ACTIVE, DISABLED
}
```

### 4.5 系统配置相关DTO

#### 4.5.1 SystemConfigRequest (系统配置请求)

**路径**: `com.agriverse.admin.dto.SystemConfigRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigRequest {
    @NotBlank(message = "配置键不能为空")
    private String configKey;
    
    private String configValue;
    private String configType;
    private String description;
    private String category;
}
```

### 4.6 操作日志相关DTO

#### 4.6.1 OperationLogSearchRequest (操作日志搜索请求)

**路径**: `com.agriverse.admin.dto.OperationLogSearchRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationLogSearchRequest {
    private String actionType;    // 操作类型
    private String targetType;    // 目标类型
    private String operatorId;    // 操作人ID
    private String result;        // 操作结果
    private LocalDateTime startTime; // 开始时间
    private LocalDateTime endTime;   // 结束时间
    private Integer page = 0;
    private Integer size = 20;
}
```

### 4.7 轮播图相关DTO

#### 4.7.1 BannerRequest (轮播图请求)

**路径**: `com.agriverse.admin.dto.BannerRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "图片URL不能为空")
    private String imageUrl;
    
    private String linkUrl;
    private Integer displayOrder;
    private Boolean enabled;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
```

### 4.8 优惠券相关DTO

#### 4.8.1 CouponRequest (优惠券请求)

**路径**: `com.agriverse.admin.dto.CouponRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    @NotBlank(message = "优惠券名称不能为空")
    private String name;
    
    @NotBlank(message = "优惠券类型不能为空")
    private String couponType; // DISCOUNT, CASH
    
    @NotNull(message = "优惠值不能为空")
    private BigDecimal value;
    
    private BigDecimal minAmount;
    
    @NotNull(message = "发放总数不能为空")
    private Integer totalCount;
    
    @NotNull(message = "有效期开始时间不能为空")
    private LocalDateTime validFrom;
    
    @NotNull(message = "有效期结束时间不能为空")
    private LocalDateTime validTo;
    
    private String targetRole; // ALL, BUYER, FARMER
    private Boolean enabled;
    private String description;
}
```

### 4.9 灰度发布相关DTO

#### 4.9.1 GrayReleaseRequest (灰度发布请求)

**路径**: `com.agriverse.admin.dto.GrayReleaseRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrayReleaseRequest {
    @NotBlank(message = "功能名称不能为空")
    private String featureName;
    
    private String description;
    
    @NotNull(message = "发布比例不能为空")
    @Min(0)
    @Max(100)
    private Integer releasePercent;
    
    private String targetUsers; // ALL, NEW, VIP
    private Boolean enabled;
}
```

---

## 5. Repository层

### 5.1 AdminOperationLogRepository

**路径**: `com.agriverse.admin.repository.AdminOperationLogRepository`

```java
@Repository
public interface AdminOperationLogRepository extends JpaRepository<AdminOperationLog, String>, JpaSpecificationExecutor<AdminOperationLog> {
    List<AdminOperationLog> findByOperatorId(String operatorId);
    
    List<AdminOperationLog> findByActionType(AdminOperationLog.ActionType actionType);
    
    List<AdminOperationLog> findByTargetTypeAndTargetId(AdminOperationLog.TargetType targetType, String targetId);
    
    @Query("SELECT l FROM AdminOperationLog l WHERE l.createdAt >= :startTime AND l.createdAt <= :endTime")
    List<AdminOperationLog> findByDateRange(@Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime);
}
```

### 5.2 AdminSystemConfigRepository

**路径**: `com.agriverse.admin.repository.AdminSystemConfigRepository`

```java
@Repository
public interface AdminSystemConfigRepository extends JpaRepository<AdminSystemConfig, String> {
    Optional<AdminSystemConfig> findByConfigKey(String configKey);
    
    List<AdminSystemConfig> findByCategory(String category);
    
    List<AdminSystemConfig> findByCategoryAndIsEditable(String category, Boolean isEditable);
}
```

### 5.3 AdminBannerRepository

**路径**: `com.agriverse.admin.repository.AdminBannerRepository`

```java
@Repository
public interface AdminBannerRepository extends JpaRepository<AdminBanner, String> {
    List<AdminBanner> findByEnabledOrderByDisplayOrderAsc(Boolean enabled);
    
    List<AdminBanner> findByEnabledAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
        Boolean enabled, LocalDateTime now1, LocalDateTime now2);
}
```

### 5.4 AdminCouponRepository

**路径**: `com.agriverse.admin.repository.AdminCouponRepository`

```java
@Repository
public interface AdminCouponRepository extends JpaRepository<AdminCoupon, String> {
    List<AdminCoupon> findByEnabled(Boolean enabled);
    
    List<AdminCoupon> findByTargetRoleAndEnabled(AdminCoupon.TargetRole targetRole, Boolean enabled);
    
    @Query("SELECT c FROM AdminCoupon c WHERE c.validFrom <= :now AND c.validTo >= :now AND c.enabled = true")
    List<AdminCoupon> findValidCoupons(@Param("now") LocalDateTime now);
}
```

### 5.5 AdminGrayReleaseRepository

**路径**: `com.agriverse.admin.repository.AdminGrayReleaseRepository`

```java
@Repository
public interface AdminGrayReleaseRepository extends JpaRepository<AdminGrayRelease, String> {
    List<AdminGrayRelease> findByEnabled(Boolean enabled);
    
    Optional<AdminGrayRelease> findByFeatureName(String featureName);
}
```

### 5.6 AdminProductAuditRepository

**路径**: `com.agriverse.admin.repository.AdminProductAuditRepository`

```java
@Repository
public interface AdminProductAuditRepository extends JpaRepository<AdminProductAudit, String>, JpaSpecificationExecutor<AdminProductAudit> {
    Optional<AdminProductAudit> findByProductId(String productId);
    
    List<AdminProductAudit> findByAuditStatus(AdminProductAudit.AuditStatus auditStatus);
    
    List<AdminProductAudit> findByFarmerId(String farmerId);
    
    @Query("SELECT a FROM AdminProductAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminProductAudit> findPendingAudits();
}
```

### 5.7 AdminContentAuditRepository

**路径**: `com.agriverse.admin.repository.AdminContentAuditRepository`

```java
@Repository
public interface AdminContentAuditRepository extends JpaRepository<AdminContentAudit, String>, JpaSpecificationExecutor<AdminContentAudit> {
    Optional<AdminContentAudit> findByContentId(String contentId);
    
    List<AdminContentAudit> findByAuditStatus(AdminContentAudit.AuditStatus auditStatus);
    
    List<AdminContentAudit> findByContentType(AdminContentAudit.ContentType contentType);
    
    @Query("SELECT a FROM AdminContentAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminContentAudit> findPendingAudits();
}
```

### 5.8 AdminExpertAuditRepository

**路径**: `com.agriverse.admin.repository.AdminExpertAuditRepository`

```java
@Repository
public interface AdminExpertAuditRepository extends JpaRepository<AdminExpertAudit, String>, JpaSpecificationExecutor<AdminExpertAudit> {
    Optional<AdminExpertAudit> findByExpertId(String expertId);
    
    List<AdminExpertAudit> findByAuditStatus(AdminExpertAudit.AuditStatus auditStatus);
    
    @Query("SELECT a FROM AdminExpertAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminExpertAudit> findPendingAudits();
}
```

---

## 6. Service层

### 6.1 AdminDashboardService (管理员仪表盘服务)

**路径**: `com.agriverse.admin.service.AdminDashboardService`

```java
@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final AdminProductAuditRepository productAuditRepository;
    private final AdminContentAuditRepository contentAuditRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public AdminDashboardStatisticsResponse getDashboardStatistics() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        
        // 今日PV/UV（需要访问日志统计，这里使用模拟数据）
        Long todayPV = getTodayPV();
        Long totalPV = getTotalPV();
        Long todayUV = getTodayUV();
        Long totalUV = getTotalUV();
        
        // 今日交易额和订单
        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(todayStart, todayEnd);
        BigDecimal todayRevenue = todayOrders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Integer todayOrdersCount = todayOrders.size();
        
        // 累计数据
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Integer totalOrdersCount = allOrders.size();
        
        // 待审核商品
        Integer pendingProducts = productAuditRepository
            .findByAuditStatus(AdminProductAudit.AuditStatus.PENDING).size();
        
        // 待审核内容
        Integer pendingContent = contentAuditRepository
            .findByAuditStatus(AdminContentAudit.AuditStatus.PENDING).size();
        
        // 在途融资
        List<FinancingApplication> activeFinancing = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.APPLIED,
                FinancingApplication.FinancingStatus.REVIEWING,
                FinancingApplication.FinancingStatus.APPROVED,
                FinancingApplication.FinancingStatus.SIGNED,
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        Integer activeFinancingCount = activeFinancing.size();
        BigDecimal totalFinancingAmount = activeFinancing.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 趋势数据
        List<TrendData> orderTrend = getOrderTrend(6);
        List<TrendData> revenueTrend = getRevenueTrend(6);
        
        return AdminDashboardStatisticsResponse.builder()
            .todayPV(todayPV)
            .totalPV(totalPV)
            .todayUV(todayUV)
            .totalUV(totalUV)
            .todayRevenue(todayRevenue)
            .totalRevenue(totalRevenue)
            .todayOrders(todayOrdersCount)
            .totalOrders(totalOrdersCount)
            .pendingProducts(pendingProducts)
            .pendingContent(pendingContent)
            .activeFinancing(activeFinancingCount)
            .totalFinancingAmount(totalFinancingAmount)
            .orderTrend(orderTrend)
            .revenueTrend(revenueTrend)
            .build();
    }
    
    /**
     * 获取订单趋势
     */
    private List<TrendData> getOrderTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<Order> orders = orderRepository.findByCreatedAtBetween(
                monthStart.atStartOfDay(),
                monthEnd.atTime(23, 59, 59));
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(orders.size())
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取交易额趋势
     */
    private List<TrendData> getRevenueTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<Order> orders = orderRepository.findByCreatedAtBetween(
                monthStart.atStartOfDay(),
                monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    // TODO: 实现PV/UV统计（需要访问日志表）
    private Long getTodayPV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTotalPV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTodayUV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTotalUV() {
        return 0L; // 需要从访问日志表统计
    }
}
```

### 6.2 AdminFinanceMonitorService (融资监控服务)

**路径**: `com.agriverse.admin.service.AdminFinanceMonitorService`

```java
@Service
@RequiredArgsConstructor
public class AdminFinanceMonitorService {
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 获取融资监控数据
     */
    public FinanceMonitorResponse getFinanceMonitor() {
        List<FinancingApplication> allApplications = applicationRepository.findAll();
        
        Integer totalApplications = allApplications.size();
        Integer pendingApprovals = (int) allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPLIED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REVIEWING)
            .count();
        Integer approvedCount = (int) allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.APPROVED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.SIGNED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED)
            .count();
        
        BigDecimal totalAmount = allApplications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal repayingAmount = allApplications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return FinanceMonitorResponse.builder()
            .totalApplications(totalApplications)
            .pendingApprovals(pendingApprovals)
            .approvedCount(approvedCount)
            .totalAmount(totalAmount)
            .repayingAmount(repayingAmount)
            .applications(allApplications)
            .build();
    }
}
```

### 6.3 AdminAuditService (审核服务)

**路径**: `com.agriverse.admin.service.AdminAuditService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuditService {
    private final AdminProductAuditRepository productAuditRepository;
    private final AdminContentAuditRepository contentAuditRepository;
    private final AdminExpertAuditRepository expertAuditRepository;
    private final FarmerProductRepository farmerProductRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 审核商品
     */
    public AdminProductAudit auditProduct(ProductAuditRequest request, String operatorId) {
        AdminProductAudit audit = productAuditRepository.findByProductId(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminProductAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminProductAudit saved = productAuditRepository.save(audit);
        
        // 更新商品状态
        FarmerProduct product = farmerProductRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("商品不存在"));
        
        if ("APPROVED".equals(request.getAuditStatus())) {
            product.setStatus("on"); // 上架
        } else if ("REJECTED".equals(request.getAuditStatus())) {
            product.setStatus("off"); // 下架
        }
        farmerProductRepository.save(product);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.PRODUCT_AUDIT,
            "审核商品: " + product.getName(),
            AdminOperationLog.TargetType.PRODUCT,
            request.getProductId(),
            product.getName()
        );
        
        return saved;
    }
    
    /**
     * 审核内容
     */
    public AdminContentAudit auditContent(ContentAuditRequest request, String operatorId) {
        AdminContentAudit audit = contentAuditRepository.findByContentId(request.getContentId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminContentAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminContentAudit saved = contentAuditRepository.save(audit);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.CONTENT_AUDIT,
            "审核内容: " + audit.getContentTitle(),
            AdminOperationLog.TargetType.CONTENT,
            request.getContentId(),
            audit.getContentTitle()
        );
        
        return saved;
    }
    
    /**
     * 审核专家
     */
    public AdminExpertAudit auditExpert(ExpertAuditRequest request, String operatorId) {
        AdminExpertAudit audit = expertAuditRepository.findByExpertId(request.getExpertId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminExpertAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminExpertAudit saved = expertAuditRepository.save(audit);
        
        // 更新用户角色状态（如果通过审核）
        if ("APPROVED".equals(request.getAuditStatus())) {
            User expert = userRepository.findById(request.getExpertId())
                .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
            // 可以在这里更新用户的专家认证状态
        }
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.EXPERT_AUDIT,
            "审核专家: " + audit.getExpertName(),
            AdminOperationLog.TargetType.EXPERT,
            request.getExpertId(),
            audit.getExpertName()
        );
        
        return saved;
    }
    
    /**
     * 获取待审核商品列表
     */
    public List<AdminProductAudit> getPendingProductAudits() {
        return productAuditRepository.findPendingAudits();
    }
    
    /**
     * 获取待审核内容列表
     */
    public List<AdminContentAudit> getPendingContentAudits() {
        return contentAuditRepository.findPendingAudits();
    }
    
    /**
     * 获取待审核专家列表
     */
    public List<AdminExpertAudit> getPendingExpertAudits() {
        return expertAuditRepository.findPendingAudits();
    }
}
```

### 6.4 AdminUserService (用户管理服务)

**路径**: `com.agriverse.admin.service.AdminUserService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {
    private final UserRepository userRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 搜索用户
     */
    public Page<User> searchUsers(UserSearchRequest request) {
        Specification<User> spec = Specification.where(null);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("name"), keyword),
                cb.like(root.get("phone"), keyword)
            ));
        }
        
        if (request.getRole() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("role"), request.getRole()));
        }
        
        if (request.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), request.getStatus()));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return userRepository.findAll(spec, pageable);
    }
    
    /**
     * 更新用户状态
     */
    public User updateUserStatus(UserStatusUpdateRequest request, String operatorId) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
        
        user.setStatus(request.getStatus());
        User saved = userRepository.save(user);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.USER_MANAGE,
            "更新用户状态: " + request.getStatus(),
            AdminOperationLog.TargetType.USER,
            request.getUserId(),
            user.getName()
        );
        
        return saved;
    }
}
```

### 6.5 AdminSystemConfigService (系统配置服务)

**路径**: `com.agriverse.admin.service.AdminSystemConfigService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminSystemConfigService {
    private final AdminSystemConfigRepository configRepository;
    
    /**
     * 获取配置值
     */
    public String getConfigValue(String configKey) {
        return configRepository.findByConfigKey(configKey)
            .map(AdminSystemConfig::getConfigValue)
            .orElse(null);
    }
    
    /**
     * 设置配置值
     */
    public AdminSystemConfig setConfigValue(SystemConfigRequest request, String updatedBy) {
        AdminSystemConfig config = configRepository.findByConfigKey(request.getConfigKey())
            .orElse(AdminSystemConfig.builder()
                .id(UUID.randomUUID().toString())
                .configKey(request.getConfigKey())
                .build());
        
        config.setConfigValue(request.getConfigValue());
        if (request.getConfigType() != null) {
            config.setConfigType(AdminSystemConfig.ConfigType.valueOf(request.getConfigType()));
        }
        if (request.getDescription() != null) {
            config.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            config.setCategory(request.getCategory());
        }
        config.setUpdatedBy(updatedBy);
        
        return configRepository.save(config);
    }
    
    /**
     * 获取分类下的所有配置
     */
    public List<AdminSystemConfig> getConfigsByCategory(String category) {
        return configRepository.findByCategory(category);
    }
    
    /**
     * 获取所有配置
     */
    public List<AdminSystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }
}
```

### 6.6 AdminOperationLogService (操作日志服务)

**路径**: `com.agriverse.admin.service.AdminOperationLogService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminOperationLogService {
    private final AdminOperationLogRepository logRepository;
    private final UserRepository userRepository;
    
    /**
     * 记录操作日志
     */
    public void logOperation(String operatorId, AdminOperationLog.ActionType actionType,
                             String actionDetail, AdminOperationLog.TargetType targetType,
                             String targetId, String targetName) {
        User operator = userRepository.findById(operatorId).orElse(null);
        
        AdminOperationLog log = AdminOperationLog.builder()
            .id(UUID.randomUUID().toString())
            .operatorId(operatorId)
            .operatorName(operator != null ? operator.getName() : null)
            .operatorRole(operator != null ? operator.getRole() : null)
            .actionType(actionType)
            .actionDetail(actionDetail)
            .targetType(targetType)
            .targetId(targetId)
            .targetName(targetName)
            .result(AdminOperationLog.OperationResult.SUCCESS)
            .build();
        
        logRepository.save(log);
    }
    
    /**
     * 记录失败操作日志
     */
    public void logFailedOperation(String operatorId, AdminOperationLog.ActionType actionType,
                                  String actionDetail, String errorMessage) {
        User operator = userRepository.findById(operatorId).orElse(null);
        
        AdminOperationLog log = AdminOperationLog.builder()
            .id(UUID.randomUUID().toString())
            .operatorId(operatorId)
            .operatorName(operator != null ? operator.getName() : null)
            .operatorRole(operator != null ? operator.getRole() : null)
            .actionType(actionType)
            .actionDetail(actionDetail)
            .result(AdminOperationLog.OperationResult.FAILED)
            .errorMessage(errorMessage)
            .build();
        
        logRepository.save(log);
    }
    
    /**
     * 搜索操作日志
     */
    public Page<AdminOperationLog> searchLogs(OperationLogSearchRequest request) {
        Specification<AdminOperationLog> spec = Specification.where(null);
        
        if (request.getActionType() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("actionType"), 
                    AdminOperationLog.ActionType.valueOf(request.getActionType())));
        }
        
        if (request.getTargetType() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("targetType"), 
                    AdminOperationLog.TargetType.valueOf(request.getTargetType())));
        }
        
        if (request.getOperatorId() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("operatorId"), request.getOperatorId()));
        }
        
        if (request.getResult() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("result"), 
                    AdminOperationLog.OperationResult.valueOf(request.getResult())));
        }
        
        if (request.getStartTime() != null && request.getEndTime() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("createdAt"), request.getStartTime(), request.getEndTime()));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return logRepository.findAll(spec, pageable);
    }
}
```

### 6.7 AdminBannerService (轮播图服务)

**路径**: `com.agriverse.admin.service.AdminBannerService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminBannerService {
    private final AdminBannerRepository bannerRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 创建轮播图
     */
    public AdminBanner createBanner(BannerRequest request, String createdBy) {
        AdminBanner banner = AdminBanner.builder()
            .id(UUID.randomUUID().toString())
            .title(request.getTitle())
            .imageUrl(request.getImageUrl())
            .linkUrl(request.getLinkUrl())
            .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
            .enabled(request.getEnabled() != null ? request.getEnabled() : true)
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .createdBy(createdBy)
            .build();
        
        AdminBanner saved = bannerRepository.save(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "创建轮播图: " + request.getTitle(),
            AdminOperationLog.TargetType.BANNER,
            saved.getId(),
            request.getTitle()
        );
        
        return saved;
    }
    
    /**
     * 更新轮播图
     */
    public AdminBanner updateBanner(String bannerId, BannerRequest request, String updatedBy) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        banner.setTitle(request.getTitle());
        banner.setImageUrl(request.getImageUrl());
        banner.setLinkUrl(request.getLinkUrl());
        if (request.getDisplayOrder() != null) {
            banner.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getEnabled() != null) {
            banner.setEnabled(request.getEnabled());
        }
        banner.setStartTime(request.getStartTime());
        banner.setEndTime(request.getEndTime());
        
        AdminBanner saved = bannerRepository.save(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "更新轮播图: " + request.getTitle(),
            AdminOperationLog.TargetType.BANNER,
            bannerId,
            request.getTitle()
        );
        
        return saved;
    }
    
    /**
     * 删除轮播图
     */
    public void deleteBanner(String bannerId, String operatorId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        bannerRepository.delete(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "删除轮播图: " + banner.getTitle(),
            AdminOperationLog.TargetType.BANNER,
            bannerId,
            banner.getTitle()
        );
    }
    
    /**
     * 获取轮播图列表
     */
    public List<AdminBanner> getBanners(Boolean enabled) {
        if (enabled != null) {
            return bannerRepository.findByEnabledOrderByDisplayOrderAsc(enabled);
        }
        return bannerRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
    }
    
    /**
     * 更新轮播图顺序
     */
    public void updateBannerOrder(String bannerId, Integer newOrder, String operatorId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        banner.setDisplayOrder(newOrder);
        bannerRepository.save(banner);
    }
    
    /**
     * 增加点击次数
     */
    public void incrementClickCount(String bannerId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElse(null);
        if (banner != null) {
            banner.setClickCount(banner.getClickCount() + 1);
            bannerRepository.save(banner);
        }
    }
}
```

### 6.8 AdminCouponService (优惠券服务)

**路径**: `com.agriverse.admin.service.AdminCouponService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminCouponService {
    private final AdminCouponRepository couponRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 创建优惠券
     */
    public AdminCoupon createCoupon(CouponRequest request, String createdBy) {
        AdminCoupon coupon = AdminCoupon.builder()
            .id(UUID.randomUUID().toString())
            .name(request.getName())
            .couponType(AdminCoupon.CouponType.valueOf(request.getCouponType()))
            .value(request.getValue())
            .minAmount(request.getMinAmount() != null ? request.getMinAmount() : BigDecimal.ZERO)
            .totalCount(request.getTotalCount())
            .usedCount(0)
            .validFrom(request.getValidFrom())
            .validTo(request.getValidTo())
            .targetRole(request.getTargetRole() != null ? 
                AdminCoupon.TargetRole.valueOf(request.getTargetRole()) : 
                AdminCoupon.TargetRole.ALL)
            .enabled(request.getEnabled() != null ? request.getEnabled() : true)
            .description(request.getDescription())
            .createdBy(createdBy)
            .build();
        
        AdminCoupon saved = couponRepository.save(coupon);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.COUPON_MANAGE,
            "创建优惠券: " + request.getName(),
            AdminOperationLog.TargetType.COUPON,
            saved.getId(),
            request.getName()
        );
        
        return saved;
    }
    
    /**
     * 更新优惠券
     */
    public AdminCoupon updateCoupon(String couponId, CouponRequest request, String updatedBy) {
        AdminCoupon coupon = couponRepository.findById(couponId)
            .orElseThrow(() -> new EntityNotFoundException("优惠券不存在"));
        
        coupon.setName(request.getName());
        if (request.getCouponType() != null) {
            coupon.setCouponType(AdminCoupon.CouponType.valueOf(request.getCouponType()));
        }
        if (request.getValue() != null) {
            coupon.setValue(request.getValue());
        }
        if (request.getMinAmount() != null) {
            coupon.setMinAmount(request.getMinAmount());
        }
        if (request.getTotalCount() != null) {
            coupon.setTotalCount(request.getTotalCount());
        }
        if (request.getValidFrom() != null) {
            coupon.setValidFrom(request.getValidFrom());
        }
        if (request.getValidTo() != null) {
            coupon.setValidTo(request.getValidTo());
        }
        if (request.getTargetRole() != null) {
            coupon.setTargetRole(AdminCoupon.TargetRole.valueOf(request.getTargetRole()));
        }
        if (request.getEnabled() != null) {
            coupon.setEnabled(request.getEnabled());
        }
        if (request.getDescription() != null) {
            coupon.setDescription(request.getDescription());
        }
        
        AdminCoupon saved = couponRepository.save(coupon);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.COUPON_MANAGE,
            "更新优惠券: " + request.getName(),
            AdminOperationLog.TargetType.COUPON,
            couponId,
            request.getName()
        );
        
        return saved;
    }
    
    /**
     * 获取优惠券列表
     */
    public List<AdminCoupon> getCoupons(Boolean enabled, String targetRole) {
        if (enabled != null && targetRole != null) {
            return couponRepository.findByTargetRoleAndEnabled(
                AdminCoupon.TargetRole.valueOf(targetRole), enabled);
        } else if (enabled != null) {
            return couponRepository.findByEnabled(enabled);
        }
        return couponRepository.findAll();
    }
    
    /**
     * 获取有效优惠券
     */
    public List<AdminCoupon> getValidCoupons() {
        return couponRepository.findValidCoupons(LocalDateTime.now());
    }
}
```

### 6.9 AdminGrayReleaseService (灰度发布服务)

**路径**: `com.agriverse.admin.service.AdminGrayReleaseService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class AdminGrayReleaseService {
    private final AdminGrayReleaseRepository grayReleaseRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 创建灰度发布
     */
    public AdminGrayRelease createGrayRelease(GrayReleaseRequest request, String createdBy) {
        AdminGrayRelease grayRelease = AdminGrayRelease.builder()
            .id(UUID.randomUUID().toString())
            .featureName(request.getFeatureName())
            .description(request.getDescription())
            .releasePercent(request.getReleasePercent())
            .targetUsers(request.getTargetUsers() != null ? 
                AdminGrayRelease.TargetUsers.valueOf(request.getTargetUsers()) : 
                AdminGrayRelease.TargetUsers.ALL)
            .enabled(request.getEnabled() != null ? request.getEnabled() : false)
            .createdBy(createdBy)
            .build();
        
        AdminGrayRelease saved = grayReleaseRepository.save(grayRelease);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.GRAY_RELEASE,
            "创建灰度发布: " + request.getFeatureName(),
            AdminOperationLog.TargetType.FEATURE,
            saved.getId(),
            request.getFeatureName()
        );
        
        return saved;
    }
    
    /**
     * 更新灰度发布
     */
    public AdminGrayRelease updateGrayRelease(String grayReleaseId, GrayReleaseRequest request, String updatedBy) {
        AdminGrayRelease grayRelease = grayReleaseRepository.findById(grayReleaseId)
            .orElseThrow(() -> new EntityNotFoundException("灰度发布不存在"));
        
        grayRelease.setFeatureName(request.getFeatureName());
        if (request.getDescription() != null) {
            grayRelease.setDescription(request.getDescription());
        }
        if (request.getReleasePercent() != null) {
            grayRelease.setReleasePercent(request.getReleasePercent());
        }
        if (request.getTargetUsers() != null) {
            grayRelease.setTargetUsers(AdminGrayRelease.TargetUsers.valueOf(request.getTargetUsers()));
        }
        if (request.getEnabled() != null) {
            grayRelease.setEnabled(request.getEnabled());
        }
        
        AdminGrayRelease saved = grayReleaseRepository.save(grayRelease);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.GRAY_RELEASE,
            "更新灰度发布: " + request.getFeatureName(),
            AdminOperationLog.TargetType.FEATURE,
            grayReleaseId,
            request.getFeatureName()
        );
        
        return saved;
    }
    
    /**
     * 获取灰度发布列表
     */
    public List<AdminGrayRelease> getGrayReleases(Boolean enabled) {
        if (enabled != null) {
            return grayReleaseRepository.findByEnabled(enabled);
        }
        return grayReleaseRepository.findAll();
    }
    
    /**
     * 检查功能是否对用户启用
     */
    public boolean isFeatureEnabledForUser(String featureName, String userId) {
        Optional<AdminGrayRelease> grayReleaseOpt = grayReleaseRepository.findByFeatureName(featureName);
        
        if (grayReleaseOpt.isEmpty()) {
            return false;
        }
        
        AdminGrayRelease grayRelease = grayReleaseOpt.get();
        if (!grayRelease.getEnabled()) {
            return false;
        }
        
        // 根据发布比例和目标用户判断
        // TODO: 实现具体的用户匹配逻辑
        return true;
    }
}
```

---

## 7. Controller层

### 7.1 AdminDashboardController (管理员仪表盘控制器)

**路径**: `com.agriverse.admin.controller.AdminDashboardController`

```java
@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "管理员仪表盘", description = "管理员数据统计和监控接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminDashboardController {
    private final AdminDashboardService dashboardService;
    
    /**
     * 获取仪表盘统计数据
     */
    @Operation(summary = "获取仪表盘统计数据", description = "获取PV/UV、交易额、订单、审核等统计数据")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminDashboardStatisticsResponse>> getStatistics() {
        try {
            AdminDashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取仪表盘统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.2 AdminFinanceMonitorController (融资监控控制器)

**路径**: `com.agriverse.admin.controller.AdminFinanceMonitorController`

```java
@RestController
@RequestMapping("/admin/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "融资监控", description = "融资申请监控和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminFinanceMonitorController {
    private final AdminFinanceMonitorService financeMonitorService;
    
    /**
     * 获取融资监控数据
     */
    @Operation(summary = "获取融资监控数据", description = "获取融资申请统计和列表")
    @GetMapping("/monitor")
    public ResponseEntity<ApiResponse<FinanceMonitorResponse>> getFinanceMonitor() {
        try {
            FinanceMonitorResponse monitor = financeMonitorService.getFinanceMonitor();
            return ResponseEntity.ok(ApiResponse.success("获取成功", monitor));
        } catch (Exception e) {
            log.error("获取融资监控数据异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.3 AdminAuditController (审核管理控制器)

**路径**: `com.agriverse.admin.controller.AdminAuditController`

```java
@RestController
@RequestMapping("/admin/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "审核管理", description = "商品、内容、专家审核接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminAuditController {
    private final AdminAuditService auditService;
    
    /**
     * 审核商品
     */
    @Operation(summary = "审核商品", description = "审核商品，批准或拒绝")
    @PostMapping("/product")
    public ResponseEntity<ApiResponse<AdminProductAudit>> auditProduct(
            @Valid @RequestBody ProductAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminProductAudit audit = auditService.auditProduct(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核商品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 审核内容
     */
    @Operation(summary = "审核内容", description = "审核内容，批准或拒绝")
    @PostMapping("/content")
    public ResponseEntity<ApiResponse<AdminContentAudit>> auditContent(
            @Valid @RequestBody ContentAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminContentAudit audit = auditService.auditContent(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 审核专家
     */
    @Operation(summary = "审核专家", description = "审核专家申请，批准或拒绝")
    @PostMapping("/expert")
    public ResponseEntity<ApiResponse<AdminExpertAudit>> auditExpert(
            @Valid @RequestBody ExpertAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminExpertAudit audit = auditService.auditExpert(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核专家异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核商品列表
     */
    @Operation(summary = "获取待审核商品列表", description = "获取所有待审核的商品")
    @GetMapping("/products/pending")
    public ResponseEntity<ApiResponse<List<AdminProductAudit>>> getPendingProductAudits() {
        try {
            List<AdminProductAudit> audits = auditService.getPendingProductAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核商品列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核内容列表
     */
    @Operation(summary = "获取待审核内容列表", description = "获取所有待审核的内容")
    @GetMapping("/contents/pending")
    public ResponseEntity<ApiResponse<List<AdminContentAudit>>> getPendingContentAudits() {
        try {
            List<AdminContentAudit> audits = auditService.getPendingContentAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核内容列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核专家列表
     */
    @Operation(summary = "获取待审核专家列表", description = "获取所有待审核的专家申请")
    @GetMapping("/experts/pending")
    public ResponseEntity<ApiResponse<List<AdminExpertAudit>>> getPendingExpertAudits() {
        try {
            List<AdminExpertAudit> audits = auditService.getPendingExpertAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核专家列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.4 AdminUserController (用户管理控制器)

**路径**: `com.agriverse.admin.controller.AdminUserController`

```java
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "用户管理", description = "用户信息管理和状态控制接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminUserController {
    private final AdminUserService userService;
    
    /**
     * 搜索用户
     */
    @Operation(summary = "搜索用户", description = "根据关键词、角色、状态等条件搜索用户")
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<User>>> searchUsers(
            @Valid @RequestBody UserSearchRequest request) {
        try {
            Page<User> users = userService.searchUsers(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", users));
        } catch (Exception e) {
            log.error("搜索用户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 更新用户状态
     */
    @Operation(summary = "更新用户状态", description = "启用或禁用用户")
    @PutMapping("/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @Valid @RequestBody UserStatusUpdateRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            User user = userService.updateUserStatus(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", user));
        } catch (Exception e) {
            log.error("更新用户状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
}
```

### 7.5 AdminSystemConfigController (系统配置控制器)

**路径**: `com.agriverse.admin.controller.AdminSystemConfigController`

```java
@RestController
@RequestMapping("/admin/config")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "系统配置", description = "系统参数配置和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminSystemConfigController {
    private final AdminSystemConfigService configService;
    
    /**
     * 获取系统配置
     */
    @Operation(summary = "获取系统配置", description = "根据分类获取系统配置")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminSystemConfig>>> getConfigs(
            @RequestParam(required = false) String category) {
        try {
            List<AdminSystemConfig> configs = category != null ?
                configService.getConfigsByCategory(category) :
                configService.getAllConfigs();
            return ResponseEntity.ok(ApiResponse.success("获取成功", configs));
        } catch (Exception e) {
            log.error("获取系统配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 设置系统配置
     */
    @Operation(summary = "设置系统配置", description = "设置或更新系统配置值")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminSystemConfig>> setConfig(
            @Valid @RequestBody SystemConfigRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminSystemConfig config = configService.setConfigValue(request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("设置成功", config));
        } catch (Exception e) {
            log.error("设置系统配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "设置失败，请稍后重试"));
        }
    }
}
```

### 7.6 AdminOperationLogController (操作日志控制器)

**路径**: `com.agriverse.admin.controller.AdminOperationLogController`

```java
@RestController
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "操作日志", description = "管理员操作日志查询和导出接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminOperationLogController {
    private final AdminOperationLogService logService;
    
    /**
     * 搜索操作日志
     */
    @Operation(summary = "搜索操作日志", description = "根据条件搜索操作日志")
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<AdminOperationLog>>> searchLogs(
            @Valid @RequestBody OperationLogSearchRequest request) {
        try {
            Page<AdminOperationLog> logs = logService.searchLogs(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", logs));
        } catch (Exception e) {
            log.error("搜索操作日志异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 导出操作日志
     */
    @Operation(summary = "导出操作日志", description = "导出操作日志为Excel文件")
    @GetMapping("/export")
    public ResponseEntity<Resource> exportLogs(
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) LocalDateTime startTime,
            @RequestParam(required = false) LocalDateTime endTime) {
        try {
            // TODO: 实现Excel导出逻辑
            // 使用POI或EasyExcel库生成Excel文件
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=operation_logs.xlsx")
                .body(null); // 返回Excel文件资源
        } catch (Exception e) {
            log.error("导出操作日志异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

### 7.7 AdminBannerController (轮播图管理控制器)

**路径**: `com.agriverse.admin.controller.AdminBannerController`

```java
@RestController
@RequestMapping("/admin/banners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "轮播图管理", description = "轮播图创建、编辑、删除管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminBannerController {
    private final AdminBannerService bannerService;
    
    /**
     * 创建轮播图
     */
    @Operation(summary = "创建轮播图", description = "创建新的轮播图")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminBanner>> createBanner(
            @Valid @RequestBody BannerRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminBanner banner = bannerService.createBanner(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", banner));
        } catch (Exception e) {
            log.error("创建轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新轮播图
     */
    @Operation(summary = "更新轮播图", description = "更新轮播图信息")
    @PutMapping("/{bannerId}")
    public ResponseEntity<ApiResponse<AdminBanner>> updateBanner(
            @PathVariable String bannerId,
            @Valid @RequestBody BannerRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminBanner banner = bannerService.updateBanner(bannerId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", banner));
        } catch (Exception e) {
            log.error("更新轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 删除轮播图
     */
    @Operation(summary = "删除轮播图", description = "删除指定的轮播图")
    @DeleteMapping("/{bannerId}")
    public ResponseEntity<ApiResponse<Object>> deleteBanner(
            @PathVariable String bannerId,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            bannerService.deleteBanner(bannerId, operatorId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 获取轮播图列表
     */
    @Operation(summary = "获取轮播图列表", description = "获取所有轮播图")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBanner>>> getBanners(
            @RequestParam(required = false) Boolean enabled) {
        try {
            List<AdminBanner> banners = bannerService.getBanners(enabled);
            return ResponseEntity.ok(ApiResponse.success("获取成功", banners));
        } catch (Exception e) {
            log.error("获取轮播图列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.8 AdminCouponController (优惠券管理控制器)

**路径**: `com.agriverse.admin.controller.AdminCouponController`

```java
@RestController
@RequestMapping("/admin/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "优惠券管理", description = "优惠券创建、编辑、发放管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminCouponController {
    private final AdminCouponService couponService;
    
    /**
     * 创建优惠券
     */
    @Operation(summary = "创建优惠券", description = "创建新的优惠券")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminCoupon>> createCoupon(
            @Valid @RequestBody CouponRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminCoupon coupon = couponService.createCoupon(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", coupon));
        } catch (Exception e) {
            log.error("创建优惠券异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新优惠券
     */
    @Operation(summary = "更新优惠券", description = "更新优惠券信息")
    @PutMapping("/{couponId}")
    public ResponseEntity<ApiResponse<AdminCoupon>> updateCoupon(
            @PathVariable String couponId,
            @Valid @RequestBody CouponRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminCoupon coupon = couponService.updateCoupon(couponId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", coupon));
        } catch (Exception e) {
            log.error("更新优惠券异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取优惠券列表
     */
    @Operation(summary = "获取优惠券列表", description = "获取所有优惠券")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCoupon>>> getCoupons(
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) String targetRole) {
        try {
            List<AdminCoupon> coupons = couponService.getCoupons(enabled, targetRole);
            return ResponseEntity.ok(ApiResponse.success("获取成功", coupons));
        } catch (Exception e) {
            log.error("获取优惠券列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.9 AdminGrayReleaseController (灰度发布控制器)

**路径**: `com.agriverse.admin.controller.AdminGrayReleaseController`

```java
@RestController
@RequestMapping("/admin/gray-release")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "灰度发布", description = "灰度功能发布管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminGrayReleaseController {
    private final AdminGrayReleaseService grayReleaseService;
    
    /**
     * 创建灰度发布
     */
    @Operation(summary = "创建灰度发布", description = "创建新的灰度发布功能")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminGrayRelease>> createGrayRelease(
            @Valid @RequestBody GrayReleaseRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminGrayRelease grayRelease = grayReleaseService.createGrayRelease(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", grayRelease));
        } catch (Exception e) {
            log.error("创建灰度发布异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新灰度发布
     */
    @Operation(summary = "更新灰度发布", description = "更新灰度发布配置")
    @PutMapping("/{grayReleaseId}")
    public ResponseEntity<ApiResponse<AdminGrayRelease>> updateGrayRelease(
            @PathVariable String grayReleaseId,
            @Valid @RequestBody GrayReleaseRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminGrayRelease grayRelease = grayReleaseService.updateGrayRelease(grayReleaseId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", grayRelease));
        } catch (Exception e) {
            log.error("更新灰度发布异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取灰度发布列表
     */
    @Operation(summary = "获取灰度发布列表", description = "获取所有灰度发布功能")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminGrayRelease>>> getGrayReleases(
            @RequestParam(required = false) Boolean enabled) {
        try {
            List<AdminGrayRelease> grayReleases = grayReleaseService.getGrayReleases(enabled);
            return ResponseEntity.ok(ApiResponse.success("获取成功", grayReleases));
        } catch (Exception e) {
            log.error("获取灰度发布列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

---

## 8. 业务流程说明

### 8.1 管理员仪表盘数据统计流程

```
1. 数据采集
   ├─ 从访问日志统计PV/UV（需要访问日志表）
   ├─ 从订单表统计交易额和订单数
   ├─ 从审核表统计待审核数量
   ├─ 从融资申请表统计在途融资
   └─ 计算趋势数据
   │
2. 数据聚合
   ├─ 计算今日数据
   ├─ 计算累计数据
   ├─ 生成趋势图表数据
   └─ 生成统计响应
   │
3. 数据返回
   └─ 返回统计结果给前端展示
```

### 8.2 审核管理流程

```
1. 商品审核
   ├─ 农户提交商品
   ├─ 系统创建审核记录（状态：待审核）
   ├─ 管理员查看待审核商品列表
   ├─ 管理员审核商品（批准/拒绝）
   ├─ 更新商品状态（上架/下架）
   ├─ 记录操作日志
   └─ 通知农户审核结果
   │
2. 内容审核
   ├─ 专家发布内容
   ├─ 系统创建审核记录（状态：待审核）
   ├─ 管理员查看待审核内容列表
   ├─ 管理员审核内容（批准/拒绝）
   ├─ 更新内容状态
   ├─ 记录操作日志
   └─ 通知专家审核结果
   │
3. 专家审核
   ├─ 用户申请成为专家
   ├─ 系统创建审核记录（状态：待审核）
   ├─ 管理员查看待审核专家列表
   ├─ 管理员审核专家（批准/拒绝）
   ├─ 更新用户角色状态
   ├─ 记录操作日志
   └─ 通知用户审核结果
```

### 8.3 用户管理流程

```
1. 用户搜索
   ├─ 输入搜索关键词（姓名、电话）
   ├─ 选择筛选条件（角色、状态）
   ├─ 执行搜索查询
   └─ 返回分页结果
   │
2. 用户状态管理
   ├─ 查看用户详情
   ├─ 启用/禁用用户
   ├─ 更新用户状态
   ├─ 记录操作日志
   └─ 通知用户状态变更
```

### 8.4 系统配置管理流程

```
1. 配置查看
   ├─ 查看所有配置
   ├─ 按分类筛选配置
   └─ 查看配置详情
   │
2. 配置更新
   ├─ 选择要更新的配置
   ├─ 修改配置值
   ├─ 保存配置
   ├─ 记录操作日志
   └─ 应用配置变更
```

### 8.5 操作日志管理流程

```
1. 日志查询
   ├─ 选择操作类型
   ├─ 选择目标类型
   ├─ 选择时间范围
   ├─ 选择操作人
   ├─ 执行搜索查询
   └─ 返回分页结果
   │
2. 日志导出
   ├─ 选择导出条件
   ├─ 生成Excel文件
   ├─ 下载文件
   └─ 记录导出操作
```

### 8.6 轮播图管理流程

```
1. 轮播图创建
   ├─ 填写轮播图信息
   ├─ 上传图片
   ├─ 设置显示顺序
   ├─ 设置启用状态
   ├─ 保存轮播图
   └─ 记录操作日志
   │
2. 轮播图管理
   ├─ 查看轮播图列表
   ├─ 编辑轮播图信息
   ├─ 调整显示顺序
   ├─ 启用/禁用轮播图
   ├─ 删除轮播图
   └─ 记录操作日志
```

### 8.7 优惠券管理流程

```
1. 优惠券创建
   ├─ 填写优惠券信息
   ├─ 设置优惠类型和金额
   ├─ 设置有效期
   ├─ 设置目标角色
   ├─ 设置发放数量
   ├─ 保存优惠券
   └─ 记录操作日志
   │
2. 优惠券管理
   ├─ 查看优惠券列表
   ├─ 编辑优惠券信息
   ├─ 查看使用统计
   ├─ 启用/禁用优惠券
   └─ 记录操作日志
```

### 8.8 灰度发布管理流程

```
1. 灰度功能创建
   ├─ 填写功能名称和描述
   ├─ 设置发布比例（0-100%）
   ├─ 设置目标用户（全部/新用户/VIP）
   ├─ 保存灰度配置
   └─ 记录操作日志
   │
2. 灰度功能管理
   ├─ 查看灰度功能列表
   ├─ 调整发布比例
   ├─ 修改目标用户
   ├─ 启用/禁用灰度功能
   └─ 记录操作日志
   │
3. 灰度功能验证
   ├─ 用户访问功能
   ├─ 检查灰度配置
   ├─ 根据比例和目标用户判断
   └─ 返回功能是否启用
```

---

## 9. API接口设计

### 9.1 管理员仪表盘接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/admin/dashboard/statistics` | 获取仪表盘统计数据 | ADMIN |

### 9.2 融资监控接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/admin/finance/monitor` | 获取融资监控数据 | ADMIN |

### 9.3 审核管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/audit/product` | 审核商品 | ADMIN |
| POST | `/api/admin/audit/content` | 审核内容 | ADMIN |
| POST | `/api/admin/audit/expert` | 审核专家 | ADMIN |
| GET | `/api/admin/audit/products/pending` | 获取待审核商品列表 | ADMIN |
| GET | `/api/admin/audit/contents/pending` | 获取待审核内容列表 | ADMIN |
| GET | `/api/admin/audit/experts/pending` | 获取待审核专家列表 | ADMIN |

### 9.4 用户管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/users/search` | 搜索用户 | ADMIN |
| PUT | `/api/admin/users/status` | 更新用户状态 | ADMIN |

### 9.5 系统配置接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/admin/config` | 获取系统配置 | ADMIN |
| POST | `/api/admin/config` | 设置系统配置 | ADMIN |

### 9.6 操作日志接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/logs/search` | 搜索操作日志 | ADMIN |
| GET | `/api/admin/logs/export` | 导出操作日志 | ADMIN |

### 9.7 轮播图管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/banners` | 创建轮播图 | ADMIN |
| PUT | `/api/admin/banners/{bannerId}` | 更新轮播图 | ADMIN |
| DELETE | `/api/admin/banners/{bannerId}` | 删除轮播图 | ADMIN |
| GET | `/api/admin/banners` | 获取轮播图列表 | ADMIN |

### 9.8 优惠券管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/coupons` | 创建优惠券 | ADMIN |
| PUT | `/api/admin/coupons/{couponId}` | 更新优惠券 | ADMIN |
| GET | `/api/admin/coupons` | 获取优惠券列表 | ADMIN |

### 9.9 灰度发布接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/admin/gray-release` | 创建灰度发布 | ADMIN |
| PUT | `/api/admin/gray-release/{grayReleaseId}` | 更新灰度发布 | ADMIN |
| GET | `/api/admin/gray-release` | 获取灰度发布列表 | ADMIN |

### 9.10 响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

---

## 10. 实现步骤

### 10.1 第一阶段：数据库和实体类

1. **创建数据库表**
   - 执行 SQL 脚本创建所有表（操作日志表、系统配置表、轮播图表、优惠券表、灰度发布表、审核记录表）
   - 验证表结构和索引
   - 创建外键约束

2. **创建实体类**
   - 按照文档创建所有实体类
   - 添加必要的注解（`@Entity`, `@Table`, `@Data`, `@Builder`等）
   - 实现枚举类型
   - 实现 `@PrePersist` 和 `@PreUpdate` 方法

3. **创建 Repository 接口**
   - 继承 `JpaRepository`
   - 添加自定义查询方法
   - 使用 `@Query` 注解编写复杂查询
   - 需要动态查询的继承 `JpaSpecificationExecutor`

### 10.2 第二阶段：Service 层

1. **实现 AdminDashboardService**
   - 仪表盘统计数据计算
   - 趋势数据生成
   - PV/UV统计（需要访问日志表）

2. **实现 AdminFinanceMonitorService**
   - 融资监控数据统计
   - 融资申请列表查询

3. **实现 AdminAuditService**
   - 商品审核功能
   - 内容审核功能
   - 专家审核功能
   - 待审核列表查询

4. **实现 AdminUserService**
   - 用户搜索功能
   - 用户状态管理

5. **实现 AdminSystemConfigService**
   - 配置读取
   - 配置更新
   - 类型转换

6. **实现 AdminOperationLogService**
   - 操作日志记录
   - 操作日志查询
   - 日志导出（Excel）

7. **实现 AdminBannerService**
   - 轮播图管理
   - 轮播图排序
   - 点击统计

8. **实现 AdminCouponService**
   - 优惠券管理
   - 优惠券发放统计

9. **实现 AdminGrayReleaseService**
   - 灰度发布管理
   - 灰度功能验证

### 10.3 第三阶段：Controller 层

1. **实现 AdminDashboardController**
   - 仪表盘统计接口
   - 参数验证
   - 异常处理

2. **实现 AdminFinanceMonitorController**
   - 融资监控接口

3. **实现 AdminAuditController**
   - 审核接口
   - 待审核列表接口

4. **实现 AdminUserController**
   - 用户搜索接口
   - 用户状态更新接口

5. **实现 AdminSystemConfigController**
   - 系统配置接口

6. **实现 AdminOperationLogController**
   - 操作日志查询接口
   - 日志导出接口

7. **实现 AdminBannerController**
   - 轮播图管理接口

8. **实现 AdminCouponController**
   - 优惠券管理接口

9. **实现 AdminGrayReleaseController**
   - 灰度发布管理接口

### 10.4 第四阶段：测试和优化

1. **单元测试**
   - Service 层测试
   - Repository 层测试
   - 业务逻辑测试

2. **集成测试**
   - Controller 层测试
   - 完整流程测试
   - API 接口测试

3. **性能优化**
   - 数据库查询优化
   - 索引优化
   - 缓存策略（Redis）
   - 并发控制

4. **Swagger集成**
   - 添加 Swagger 注解
   - 配置 API 文档
   - 测试接口功能

### 10.5 第五阶段：文档和部署

1. **API 文档**
   - 使用 Swagger 生成 API 文档
   - 补充接口说明
   - 添加示例数据

2. **部署准备**
   - 配置文件优化
   - 日志配置
   - 监控配置

---

## 11. 注意事项

### 11.1 数据一致性

- 使用 `@Transactional` 保证事务一致性
- 审核操作要同步更新相关实体状态
- 系统配置修改要确保实时生效
- 操作日志要保证完整性

### 11.2 安全性

- 所有接口需要 JWT 认证
- 权限控制使用 `@PreAuthorize("hasRole('ADMIN')")`
- 敏感操作要记录操作日志
- 系统配置修改要验证权限
- 用户状态修改要谨慎处理

### 11.3 性能考虑

- 大数据量查询使用分页
- 复杂计算考虑缓存（Redis）
- 操作日志查询使用索引优化
- 仪表盘数据可以考虑定时计算缓存
- 审核列表查询使用索引

### 11.4 异常处理

- 统一异常处理机制
- 友好的错误提示
- 记录异常日志
- 审核操作异常处理

### 11.5 业务规则

- 审核状态流转验证
- 系统配置权限控制
- 轮播图顺序管理
- 优惠券有效期验证
- 灰度发布比例验证

### 11.6 扩展功能

- PV/UV统计需要访问日志表支持
- Excel导出需要POI或EasyExcel库
- 操作日志可以增加更多维度统计
- 可以增加审核工作流功能
- 可以增加系统配置版本管理

---

## 12. 扩展功能（后续实现）

1. **访问日志统计**
   - 访问日志表设计
   - PV/UV实时统计
   - 用户行为分析

2. **审核工作流**
   - 多级审核流程
   - 审核任务分配
   - 审核提醒通知

3. **系统配置版本管理**
   - 配置历史记录
   - 配置回滚功能
   - 配置变更审批

4. **数据报表**
   - 运营数据报表
   - 审核效率报表
   - 用户行为报表

5. **消息通知**
   - 审核结果通知
   - 系统配置变更通知
   - 异常操作预警通知

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。