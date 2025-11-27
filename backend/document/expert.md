# 专家模块后端实现流程文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 专家功能管理

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

### 1.1 专家仪表盘

1. **数据统计**
   - 待回答问题数量
   - 已回答问题数量
   - 总收入统计（问答收入 + 预约收入）
   - 可提现余额
   - 可用预约时段数量
   - 已预约时段数量

2. **趋势分析**
   - 收入趋势图表（近6个月）
   - 问答数量趋势
   - 预约数量趋势

3. **快捷操作**
   - 快速跳转到问答中心
   - 快速跳转到预约管理
   - 快速跳转到知识发布
   - 快速跳转到收入中心

### 1.2 问答管理

1. **问题列表**
   - 待回答问题列表
   - 已回答问题列表
   - 问题搜索和筛选
   - 问题详情查看

2. **回答管理**
   - 回答问题
   - 编辑回答
   - 查看回答详情
   - 采纳答案（农户操作，专家查看）

3. **奖励机制**
   - 回答问题获得奖励
   - 答案被采纳获得额外奖励
   - 奖励自动计入收入

### 1.3 预约管理

1. **时段管理**
   - 设置可预约时段
   - 查看可用时段列表
   - 编辑时段
   - 删除时段

2. **预约请求管理**
   - 查看预约请求列表
   - 确认预约
   - 拒绝预约
   - 取消预约
   - 完成预约

3. **预约统计**
   - 今日预约数量
   - 本周预约数量
   - 预约完成率

### 1.4 知识发布

1. **内容发布**
   - 发布文章
   - 发布视频
   - 发布图片
   - 内容编辑和删除

2. **内容管理**
   - 内容列表查看
   - 内容状态管理（草稿、已发布、已下架）
   - 内容审核状态查看

3. **内容统计**
   - 内容浏览量
   - 内容点赞数
   - 内容评论数

### 1.5 收入管理

1. **收入统计**
   - 问答收入统计
   - 预约收入统计
   - 总收入统计
   - 累计提现金额
   - 可提现余额

2. **收入明细**
   - 收入记录列表
   - 收入来源分类
   - 收入时间筛选

3. **提现管理**
   - 提现申请
   - 提现记录查询
   - 提现状态跟踪

### 1.6 服务价格设置

1. **价格管理**
   - 设置问答价格
   - 设置预约咨询价格
   - 价格修改历史

### 1.7 资质管理

1. **资质上传**
   - 上传资质证明文件
   - 查看已上传资质
   - 资质审核状态查看

### 1.8 农户评价

1. **评价查看**
   - 查看农户评价列表
   - 评价详情查看
   - 评价统计（平均评分、评价数量）

---

## 2. 数据库设计

### 2.1 专家信息表 (expert_profiles)

```sql
CREATE TABLE IF NOT EXISTS expert_profiles (
    id VARCHAR(36) PRIMARY KEY COMMENT '专家信息ID',
    expert_id VARCHAR(36) NOT NULL UNIQUE COMMENT '专家用户ID',
    specialty VARCHAR(200) COMMENT '专业领域',
    qualification VARCHAR(500) COMMENT '资质证明',
    experience TEXT COMMENT '经验描述',
    service_price DECIMAL(10,2) DEFAULT 0 COMMENT '服务价格（元/次）',
    qa_price DECIMAL(10,2) DEFAULT 0 COMMENT '问答价格（元/次）',
    rating DECIMAL(3,2) DEFAULT 0 COMMENT '平均评分（0-5）',
    total_consultations INT DEFAULT 0 COMMENT '累计咨询次数',
    total_income DECIMAL(15,2) DEFAULT 0 COMMENT '累计收入',
    withdrawable_balance DECIMAL(15,2) DEFAULT 0 COMMENT '可提现余额',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家信息表';
```

### 2.2 问答表 (expert_questions)

```sql
CREATE TABLE IF NOT EXISTS expert_questions (
    id VARCHAR(36) PRIMARY KEY COMMENT '问题ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    farmer_name VARCHAR(100) COMMENT '农户姓名',
    title VARCHAR(200) NOT NULL COMMENT '问题标题',
    content TEXT NOT NULL COMMENT '问题内容',
    bounty DECIMAL(10,2) DEFAULT 0 COMMENT '悬赏金额（元）',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待回答, ANSWERED-已回答, ADOPTED-已采纳',
    adopted_answer_id VARCHAR(36) COMMENT '采纳的答案ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (farmer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问答表';
```

### 2.3 答案表 (expert_answers)

```sql
CREATE TABLE IF NOT EXISTS expert_answers (
    id VARCHAR(36) PRIMARY KEY COMMENT '答案ID',
    question_id VARCHAR(36) NOT NULL COMMENT '问题ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    expert_name VARCHAR(100) COMMENT '专家姓名',
    content TEXT NOT NULL COMMENT '答案内容',
    is_adopted BOOLEAN DEFAULT FALSE COMMENT '是否被采纳',
    reward DECIMAL(10,2) DEFAULT 0 COMMENT '奖励金额（元）',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_question_id (question_id),
    INDEX idx_expert_id (expert_id),
    INDEX idx_is_adopted (is_adopted),
    FOREIGN KEY (question_id) REFERENCES expert_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='答案表';
```

### 2.4 预约时段表 (expert_available_slots)

```sql
CREATE TABLE IF NOT EXISTS expert_available_slots (
    id VARCHAR(36) PRIMARY KEY COMMENT '时段ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    slot_date DATE NOT NULL COMMENT '日期',
    time_slot VARCHAR(50) NOT NULL COMMENT '时间段（如：14:00-15:00）',
    is_available BOOLEAN DEFAULT TRUE COMMENT '是否可用',
    is_booked BOOLEAN DEFAULT FALSE COMMENT '是否已预约',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_slot_date (slot_date),
    INDEX idx_is_available (is_available),
    INDEX idx_is_booked (is_booked),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预约时段表';
```

### 2.5 预约记录表 (expert_appointments)

```sql
CREATE TABLE IF NOT EXISTS expert_appointments (
    id VARCHAR(36) PRIMARY KEY COMMENT '预约ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    farmer_name VARCHAR(100) COMMENT '农户姓名',
    slot_id VARCHAR(36) COMMENT '时段ID',
    appointment_date DATE NOT NULL COMMENT '预约日期',
    time_slot VARCHAR(50) NOT NULL COMMENT '时间段',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待确认, CONFIRMED-已确认, CANCELLED-已取消, COMPLETED-已完成',
    amount DECIMAL(10,2) DEFAULT 0 COMMENT '咨询费用（元）',
    payment_status VARCHAR(20) DEFAULT 'UNPAID' COMMENT '支付状态: UNPAID-未支付, PAID-已支付, REFUNDED-已退款',
    farmer_comment TEXT COMMENT '农户备注',
    expert_comment TEXT COMMENT '专家备注',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    FOREIGN KEY (expert_id) REFERENCES users(id),
    FOREIGN KEY (farmer_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES expert_available_slots(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预约记录表';
```

### 2.6 专家内容表 (expert_contents)

```sql
CREATE TABLE IF NOT EXISTS expert_contents (
    id VARCHAR(36) PRIMARY KEY COMMENT '内容ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    content_type VARCHAR(20) NOT NULL COMMENT '内容类型: ARTICLE-文章, VIDEO-视频, IMAGE-图片',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    summary VARCHAR(500) COMMENT '摘要',
    content TEXT COMMENT '内容正文',
    cover_url VARCHAR(500) COMMENT '封面图片URL',
    video_url VARCHAR(500) COMMENT '视频URL',
    images TEXT COMMENT '图片URL列表（JSON格式）',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态: DRAFT-草稿, PUBLISHED-已发布, OFFLINE-已下架',
    audit_status VARCHAR(20) DEFAULT 'PENDING' COMMENT '审核状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    published_at DATETIME COMMENT '发布时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_content_type (content_type),
    INDEX idx_status (status),
    INDEX idx_audit_status (audit_status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家内容表';
```

### 2.7 专家收入记录表 (expert_income_records)

```sql
CREATE TABLE IF NOT EXISTS expert_income_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '收入记录ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    income_type VARCHAR(20) NOT NULL COMMENT '收入类型: QA-问答, APPOINTMENT-预约, ADOPTION-采纳奖励',
    source_id VARCHAR(36) COMMENT '来源ID（问题ID、预约ID等）',
    amount DECIMAL(10,2) NOT NULL COMMENT '收入金额（元）',
    description VARCHAR(500) COMMENT '收入描述',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING-待结算, SETTLED-已结算, CANCELLED-已取消',
    settled_at DATETIME COMMENT '结算时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_income_type (income_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家收入记录表';
```

### 2.8 专家提现记录表 (expert_withdrawals)

```sql
CREATE TABLE IF NOT EXISTS expert_withdrawals (
    id VARCHAR(36) PRIMARY KEY COMMENT '提现记录ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额（元）',
    bank_account VARCHAR(50) COMMENT '银行账户',
    account_name VARCHAR(100) COMMENT '账户名称',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待处理, PROCESSING-处理中, SUCCESS-成功, FAILED-失败',
    transaction_id VARCHAR(100) COMMENT '交易流水号',
    remark TEXT COMMENT '备注',
    processed_at DATETIME COMMENT '处理时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (expert_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家提现记录表';
```

### 2.9 农户评价表 (farmer_reviews)

```sql
CREATE TABLE IF NOT EXISTS farmer_reviews (
    id VARCHAR(36) PRIMARY KEY COMMENT '评价ID',
    expert_id VARCHAR(36) NOT NULL COMMENT '专家ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    farmer_name VARCHAR(100) COMMENT '农户姓名',
    appointment_id VARCHAR(36) COMMENT '预约ID',
    rating INT NOT NULL COMMENT '评分（1-5）',
    comment TEXT COMMENT '评价内容',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_expert_id (expert_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (expert_id) REFERENCES users(id),
    FOREIGN KEY (farmer_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES expert_appointments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='农户评价表';
```

---

## 3. 实体类设计

### 3.1 ExpertProfile (专家信息)

**路径**: `com.agriverse.expert.entity.ExpertProfile`

```java
@Entity
@Table(name = "expert_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertProfile {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, unique = true, length = 36)
    private String expertId;
    
    @Column(length = 200)
    private String specialty;
    
    @Column(length = 500)
    private String qualification;
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    @Column(name = "service_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal servicePrice = BigDecimal.ZERO;
    
    @Column(name = "qa_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal qaPrice = BigDecimal.ZERO;
    
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;
    
    @Column(name = "total_consultations")
    @Builder.Default
    private Integer totalConsultations = 0;
    
    @Column(name = "total_income", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalIncome = BigDecimal.ZERO;
    
    @Column(name = "withdrawable_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal withdrawableBalance = BigDecimal.ZERO;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExpertStatus status = ExpertStatus.PENDING;
    
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
    
    public enum ExpertStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

### 3.2 ExpertQuestion (问答)

**路径**: `com.agriverse.expert.entity.ExpertQuestion`

```java
@Entity
@Table(name = "expert_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertQuestion {
    @Id
    private String id;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal bounty = BigDecimal.ZERO;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QuestionStatus status = QuestionStatus.PENDING;
    
    @Column(name = "adopted_answer_id", length = 36)
    private String adoptedAnswerId;
    
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
    
    public enum QuestionStatus {
        PENDING, ANSWERED, ADOPTED
    }
}
```

### 3.3 ExpertAnswer (答案)

**路径**: `com.agriverse.expert.entity.ExpertAnswer`

```java
@Entity
@Table(name = "expert_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertAnswer {
    @Id
    private String id;
    
    @Column(name = "question_id", nullable = false, length = 36)
    private String questionId;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "expert_name", length = 100)
    private String expertName;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "is_adopted")
    @Builder.Default
    private Boolean isAdopted = false;
    
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal reward = BigDecimal.ZERO;
    
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

### 3.4 ExpertAvailableSlot (预约时段)

**路径**: `com.agriverse.expert.entity.ExpertAvailableSlot`

```java
@Entity
@Table(name = "expert_available_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertAvailableSlot {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;
    
    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot;
    
    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;
    
    @Column(name = "is_booked")
    @Builder.Default
    private Boolean isBooked = false;
    
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

### 3.5 ExpertAppointment (预约记录)

**路径**: `com.agriverse.expert.entity.ExpertAppointment`

```java
@Entity
@Table(name = "expert_appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertAppointment {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
    @Column(name = "slot_id", length = 36)
    private String slotId;
    
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;
    
    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.PENDING;
    
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal amount = BigDecimal.ZERO;
    
    @Column(name = "payment_status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;
    
    @Column(name = "farmer_comment", columnDefinition = "TEXT")
    private String farmerComment;
    
    @Column(name = "expert_comment", columnDefinition = "TEXT")
    private String expertComment;
    
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
    
    public enum AppointmentStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
    
    public enum PaymentStatus {
        UNPAID, PAID, REFUNDED
    }
}
```

### 3.6 ExpertContent (专家内容)

**路径**: `com.agriverse.expert.entity.ExpertContent`

```java
@Entity
@Table(name = "expert_contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertContent {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "content_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 500)
    private String summary;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    
    @Column(name = "video_url", length = 500)
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String images; // JSON格式
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(name = "like_count")
    @Builder.Default
    private Integer likeCount = 0;
    
    @Column(name = "comment_count")
    @Builder.Default
    private Integer commentCount = 0;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContentStatus status = ContentStatus.DRAFT;
    
    @Column(name = "audit_status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuditStatus auditStatus = AuditStatus.PENDING;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
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
        ARTICLE, VIDEO, IMAGE
    }
    
    public enum ContentStatus {
        DRAFT, PUBLISHED, OFFLINE
    }
    
    public enum AuditStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

### 3.7 ExpertIncomeRecord (收入记录)

**路径**: `com.agriverse.expert.entity.ExpertIncomeRecord`

```java
@Entity
@Table(name = "expert_income_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertIncomeRecord {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "income_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private IncomeType incomeType;
    
    @Column(name = "source_id", length = 36)
    private String sourceId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncomeStatus status = IncomeStatus.PENDING;
    
    @Column(name = "settled_at")
    private LocalDateTime settledAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum IncomeType {
        QA, APPOINTMENT, ADOPTION
    }
    
    public enum IncomeStatus {
        PENDING, SETTLED, CANCELLED
    }
}
```

### 3.8 ExpertWithdrawal (提现记录)

**路径**: `com.agriverse.expert.entity.ExpertWithdrawal`

```java
@Entity
@Table(name = "expert_withdrawals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertWithdrawal {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "bank_account", length = 50)
    private String bankAccount;
    
    @Column(name = "account_name", length = 100)
    private String accountName;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WithdrawalStatus status = WithdrawalStatus.PENDING;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(columnDefinition = "TEXT")
    private String remark;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
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
    
    public enum WithdrawalStatus {
        PENDING, PROCESSING, SUCCESS, FAILED
    }
}
```

### 3.9 FarmerReview (农户评价)

**路径**: `com.agriverse.expert.entity.FarmerReview`

```java
@Entity
@Table(name = "farmer_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerReview {
    @Id
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
    @Column(name = "appointment_id", length = 36)
    private String appointmentId;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

---

## 4. DTO设计

### 4.1 仪表盘相关DTO

#### 4.1.1 ExpertDashboardStatisticsResponse (仪表盘统计响应)

**路径**: `com.agriverse.expert.dto.ExpertDashboardStatisticsResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertDashboardStatisticsResponse {
    private Integer pendingQuestionsCount;      // 待回答问题数
    private Integer answeredQuestionsCount;    // 已回答问题数
    private BigDecimal totalIncome;            // 总收入
    private BigDecimal withdrawableBalance;     // 可提现余额
    private Integer availableSlotsCount;        // 可用时段数
    private Integer bookedSlotsCount;           // 已预约时段数
    private List<TrendData> incomeTrend;        // 收入趋势
    private List<TrendData> qaTrend;            // 问答趋势
    private List<TrendData> appointmentTrend;   // 预约趋势
}
```

### 4.2 问答相关DTO

#### 4.2.1 QuestionSearchRequest (问题搜索请求)

**路径**: `com.agriverse.expert.dto.QuestionSearchRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSearchRequest {
    private String keyword;      // 搜索关键词
    private String status;        // 状态筛选
    private Integer page = 0;
    private Integer size = 20;
}
```

#### 4.2.2 AnswerRequest (回答请求)

**路径**: `com.agriverse.expert.dto.AnswerRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    @NotBlank(message = "问题ID不能为空")
    private String questionId;
    
    @NotBlank(message = "答案内容不能为空")
    private String content;
}
```

### 4.3 预约相关DTO

#### 4.3.1 AvailableSlotRequest (可用时段请求)

**路径**: `com.agriverse.expert.dto.AvailableSlotRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotRequest {
    @NotNull(message = "日期不能为空")
    private LocalDate slotDate;
    
    @NotBlank(message = "时间段不能为空")
    private String timeSlot; // 如：14:00-15:00
}
```

#### 4.3.2 AppointmentStatusUpdateRequest (预约状态更新请求)

**路径**: `com.agriverse.expert.dto.AppointmentStatusUpdateRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusUpdateRequest {
    @NotBlank(message = "预约ID不能为空")
    private String appointmentId;
    
    @NotBlank(message = "状态不能为空")
    private String status; // CONFIRMED, CANCELLED, COMPLETED
    
    private String comment; // 备注
}
```

### 4.4 内容相关DTO

#### 4.4.1 ContentPublishRequest (内容发布请求)

**路径**: `com.agriverse.expert.dto.ContentPublishRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentPublishRequest {
    @NotBlank(message = "内容类型不能为空")
    private String contentType; // ARTICLE, VIDEO, IMAGE
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    private String summary;
    private String content;
    private String coverUrl;
    private String videoUrl;
    private List<String> images;
}
```

### 4.5 收入相关DTO

#### 4.5.1 WithdrawalRequest (提现请求)

**路径**: `com.agriverse.expert.dto.WithdrawalRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequest {
    @NotNull(message = "提现金额不能为空")
    @DecimalMin(value = "0.01", message = "提现金额必须大于0")
    private BigDecimal amount;
    
    @NotBlank(message = "银行账户不能为空")
    private String bankAccount;
    
    @NotBlank(message = "账户名称不能为空")
    private String accountName;
}
```

#### 4.5.2 IncomeStatisticsResponse (收入统计响应)

**路径**: `com.agriverse.expert.dto.IncomeStatisticsResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomeStatisticsResponse {
    private BigDecimal qaIncome;              // 问答收入
    private BigDecimal appointmentIncome;     // 预约收入
    private BigDecimal adoptionIncome;         // 采纳奖励收入
    private BigDecimal totalIncome;            // 总收入
    private BigDecimal withdrawTotal;          // 累计提现
    private BigDecimal withdrawableBalance;   // 可提现余额
}
```

### 4.6 价格设置相关DTO

#### 4.6.1 ServicePriceUpdateRequest (服务价格更新请求)

**路径**: `com.agriverse.expert.dto.ServicePriceUpdateRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePriceUpdateRequest {
    private BigDecimal servicePrice; // 预约咨询价格
    private BigDecimal qaPrice;      // 问答价格
}
```

---

## 5. Repository层

### 5.1 ExpertProfileRepository

**路径**: `com.agriverse.expert.repository.ExpertProfileRepository`

```java
@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, String> {
    Optional<ExpertProfile> findByExpertId(String expertId);
    
    List<ExpertProfile> findByStatus(ExpertProfile.ExpertStatus status);
    
    @Query("SELECT e FROM ExpertProfile e WHERE e.status = 'APPROVED' " +
           "ORDER BY e.rating DESC, e.totalConsultations DESC")
    List<ExpertProfile> findTopExperts(@Param("limit") int limit);
}
```

### 5.2 ExpertQuestionRepository

**路径**: `com.agriverse.expert.repository.ExpertQuestionRepository`

```java
@Repository
public interface ExpertQuestionRepository extends JpaRepository<ExpertQuestion, String>, JpaSpecificationExecutor<ExpertQuestion> {
    List<ExpertQuestion> findByFarmerId(String farmerId);
    
    List<ExpertQuestion> findByStatus(ExpertQuestion.QuestionStatus status);
    
    @Query("SELECT q FROM ExpertQuestion q WHERE q.status = 'PENDING' " +
           "ORDER BY q.createdAt ASC")
    List<ExpertQuestion> findPendingQuestions();
    
    @Query("SELECT q FROM ExpertQuestion q WHERE q.status = 'PENDING' " +
           "AND (q.title LIKE %:keyword% OR q.content LIKE %:keyword%)")
    List<ExpertQuestion> searchPendingQuestions(@Param("keyword") String keyword);
}
```

### 5.3 ExpertAnswerRepository

**路径**: `com.agriverse.expert.repository.ExpertAnswerRepository`

```java
@Repository
public interface ExpertAnswerRepository extends JpaRepository<ExpertAnswer, String> {
    List<ExpertAnswer> findByQuestionId(String questionId);
    
    List<ExpertAnswer> findByExpertId(String expertId);
    
    List<ExpertAnswer> findByQuestionIdOrderByCreatedAtAsc(String questionId);
    
    Optional<ExpertAnswer> findByQuestionIdAndIsAdopted(String questionId, Boolean isAdopted);
}
```

### 5.4 ExpertAvailableSlotRepository

**路径**: `com.agriverse.expert.repository.ExpertAvailableSlotRepository`

```java
@Repository
public interface ExpertAvailableSlotRepository extends JpaRepository<ExpertAvailableSlot, String> {
    List<ExpertAvailableSlot> findByExpertId(String expertId);
    
    List<ExpertAvailableSlot> findByExpertIdAndSlotDate(String expertId, LocalDate slotDate);
    
    List<ExpertAvailableSlot> findByExpertIdAndIsAvailableAndIsBooked(
        String expertId, Boolean isAvailable, Boolean isBooked);
    
    @Query("SELECT s FROM ExpertAvailableSlot s WHERE s.expertId = :expertId " +
           "AND s.slotDate >= :startDate AND s.slotDate <= :endDate " +
           "AND s.isAvailable = true AND s.isBooked = false")
    List<ExpertAvailableSlot> findAvailableSlotsInRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}
```

### 5.5 ExpertAppointmentRepository

**路径**: `com.agriverse.expert.repository.ExpertAppointmentRepository`

```java
@Repository
public interface ExpertAppointmentRepository extends JpaRepository<ExpertAppointment, String>, JpaSpecificationExecutor<ExpertAppointment> {
    List<ExpertAppointment> findByExpertId(String expertId);
    
    List<ExpertAppointment> findByFarmerId(String farmerId);
    
    List<ExpertAppointment> findByExpertIdAndStatus(String expertId, ExpertAppointment.AppointmentStatus status);
    
    List<ExpertAppointment> findByExpertIdAndAppointmentDate(
        String expertId, LocalDate appointmentDate);
    
    @Query("SELECT a FROM ExpertAppointment a WHERE a.expertId = :expertId " +
           "AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<ExpertAppointment> findByExpertIdAndDateRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}
```

### 5.6 ExpertContentRepository

**路径**: `com.agriverse.expert.repository.ExpertContentRepository`

```java
@Repository
public interface ExpertContentRepository extends JpaRepository<ExpertContent, String>, JpaSpecificationExecutor<ExpertContent> {
    List<ExpertContent> findByExpertId(String expertId);
    
    List<ExpertContent> findByExpertIdAndContentType(String expertId, ExpertContent.ContentType contentType);
    
    List<ExpertContent> findByExpertIdAndStatus(String expertId, ExpertContent.ContentStatus status);
    
    @Query("SELECT c FROM ExpertContent c WHERE c.status = 'PUBLISHED' " +
           "AND c.auditStatus = 'APPROVED' " +
           "ORDER BY c.publishedAt DESC")
    List<ExpertContent> findPublishedContents(@Param("limit") int limit);
}
```

### 5.7 ExpertIncomeRecordRepository

**路径**: `com.agriverse.expert.repository.ExpertIncomeRecordRepository`

```java
@Repository
public interface ExpertIncomeRecordRepository extends JpaRepository<ExpertIncomeRecord, String> {
    List<ExpertIncomeRecord> findByExpertId(String expertId);
    
    List<ExpertIncomeRecord> findByExpertIdAndIncomeType(String expertId, ExpertIncomeRecord.IncomeType incomeType);
    
    List<ExpertIncomeRecord> findByExpertIdAndStatus(String expertId, ExpertIncomeRecord.IncomeStatus status);
    
    @Query("SELECT SUM(r.amount) FROM ExpertIncomeRecord r WHERE r.expertId = :expertId " +
           "AND r.incomeType = :incomeType AND r.status = 'SETTLED'")
    BigDecimal getTotalIncomeByType(@Param("expertId") String expertId,
                                    @Param("incomeType") ExpertIncomeRecord.IncomeType incomeType);
    
    @Query("SELECT r FROM ExpertIncomeRecord r WHERE r.expertId = :expertId " +
           "AND r.createdAt >= :startDate AND r.createdAt <= :endDate")
    List<ExpertIncomeRecord> findByExpertIdAndDateRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);
}
```

### 5.8 ExpertWithdrawalRepository

**路径**: `com.agriverse.expert.repository.ExpertWithdrawalRepository`

```java
@Repository
public interface ExpertWithdrawalRepository extends JpaRepository<ExpertWithdrawal, String> {
    List<ExpertWithdrawal> findByExpertId(String expertId);
    
    List<ExpertWithdrawal> findByExpertIdAndStatus(String expertId, ExpertWithdrawal.WithdrawalStatus status);
    
    @Query("SELECT SUM(w.amount) FROM ExpertWithdrawal w WHERE w.expertId = :expertId " +
           "AND w.status = 'SUCCESS'")
    BigDecimal getTotalWithdrawnAmount(@Param("expertId") String expertId);
}
```

### 5.9 FarmerReviewRepository

**路径**: `com.agriverse.expert.repository.FarmerReviewRepository`

```java
@Repository
public interface FarmerReviewRepository extends JpaRepository<FarmerReview, String> {
    List<FarmerReview> findByExpertId(String expertId);
    
    List<FarmerReview> findByExpertIdOrderByCreatedAtDesc(String expertId);
    
    @Query("SELECT AVG(r.rating) FROM FarmerReview r WHERE r.expertId = :expertId")
    BigDecimal getAverageRating(@Param("expertId") String expertId);
    
    @Query("SELECT COUNT(r) FROM FarmerReview r WHERE r.expertId = :expertId")
    Long getReviewCount(@Param("expertId") String expertId);
}
```

---

## 6. Service层

### 6.1 ExpertDashboardService (专家仪表盘服务)

**路径**: `com.agriverse.expert.service.ExpertDashboardService`

```java
@Service
@RequiredArgsConstructor
public class ExpertDashboardService {
    private final ExpertQuestionRepository questionRepository;
    private final ExpertAnswerRepository answerRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertAvailableSlotRepository slotRepository;
    private final ExpertAppointmentRepository appointmentRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public ExpertDashboardStatisticsResponse getDashboardStatistics(String expertId) {
        // 待回答问题数
        Integer pendingQuestionsCount = questionRepository.findPendingQuestions().size();
        
        // 已回答问题数
        List<ExpertAnswer> answers = answerRepository.findByExpertId(expertId);
        Integer answeredQuestionsCount = answers.size();
        
        // 收入统计
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        BigDecimal totalIncome = profile.getTotalIncome();
        BigDecimal withdrawableBalance = profile.getWithdrawableBalance();
        
        // 时段统计
        List<ExpertAvailableSlot> availableSlots = slotRepository
            .findByExpertIdAndIsAvailableAndIsBooked(expertId, true, false);
        Integer availableSlotsCount = availableSlots.size();
        
        List<ExpertAvailableSlot> bookedSlots = slotRepository
            .findByExpertIdAndIsAvailableAndIsBooked(expertId, true, true);
        Integer bookedSlotsCount = bookedSlots.size();
        
        // 趋势数据（近6个月）
        List<TrendData> incomeTrend = getIncomeTrend(expertId, 6);
        List<TrendData> qaTrend = getQATrend(expertId, 6);
        List<TrendData> appointmentTrend = getAppointmentTrend(expertId, 6);
        
        return ExpertDashboardStatisticsResponse.builder()
            .pendingQuestionsCount(pendingQuestionsCount)
            .answeredQuestionsCount(answeredQuestionsCount)
            .totalIncome(totalIncome)
            .withdrawableBalance(withdrawableBalance)
            .availableSlotsCount(availableSlotsCount)
            .bookedSlotsCount(bookedSlotsCount)
            .incomeTrend(incomeTrend)
            .qaTrend(qaTrend)
            .appointmentTrend(appointmentTrend)
            .build();
    }
    
    /**
     * 获取收入趋势
     */
    private List<TrendData> getIncomeTrend(String expertId, int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertIncomeRecord> records = incomeRecordRepository
                .findByExpertIdAndDateRange(
                    expertId,
                    monthStart.atStartOfDay(),
                    monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = records.stream()
                .filter(r -> r.getStatus() == ExpertIncomeRecord.IncomeStatus.SETTLED)
                .map(ExpertIncomeRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取问答趋势
     */
    private List<TrendData> getQATrend(String expertId, int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertAnswer> answers = answerRepository.findByExpertId(expertId).stream()
                .filter(a -> a.getCreatedAt().isAfter(monthStart.atStartOfDay()) &&
                           a.getCreatedAt().isBefore(monthEnd.atTime(23, 59, 59)))
                .collect(Collectors.toList());
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(answers.size())
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取预约趋势
     */
    private List<TrendData> getAppointmentTrend(String expertId, int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertAppointment> appointments = appointmentRepository
                .findByExpertIdAndDateRange(expertId, monthStart, monthEnd);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(appointments.size())
            ));
        }
        
        return trend;
    }
}
```

### 6.2 ExpertQAService (问答服务)

**路径**: `com.agriverse.expert.service.ExpertQAService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExpertQAService {
    private final ExpertQuestionRepository questionRepository;
    private final ExpertAnswerRepository answerRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final UserRepository userRepository;
    
    /**
     * 搜索问题
     */
    public Page<ExpertQuestion> searchQuestions(QuestionSearchRequest request) {
        Specification<ExpertQuestion> spec = Specification.where(null);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("title"), keyword),
                cb.like(root.get("content"), keyword)
            ));
        }
        
        if (request.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertQuestion.QuestionStatus.valueOf(request.getStatus())));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return questionRepository.findAll(spec, pageable);
    }
    
    /**
     * 回答问题
     */
    public ExpertAnswer answerQuestion(AnswerRequest request, String expertId) {
        ExpertQuestion question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new EntityNotFoundException("问题不存在"));
        
        if (question.getStatus() != ExpertQuestion.QuestionStatus.PENDING) {
            throw new IllegalStateException("问题已被回答或已采纳");
        }
        
        User expert = userRepository.findById(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家不存在"));
        
        ExpertAnswer answer = ExpertAnswer.builder()
            .id(UUID.randomUUID().toString())
            .questionId(request.getQuestionId())
            .expertId(expertId)
            .expertName(expert.getName())
            .content(request.getContent())
            .isAdopted(false)
            .reward(question.getBounty())
            .build();
        
        ExpertAnswer saved = answerRepository.save(answer);
        
        // 更新问题状态
        question.setStatus(ExpertQuestion.QuestionStatus.ANSWERED);
        questionRepository.save(question);
        
        // 创建收入记录
        ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .incomeType(ExpertIncomeRecord.IncomeType.QA)
            .sourceId(request.getQuestionId())
            .amount(question.getBounty())
            .description("回答问题奖励")
            .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
            .settledAt(LocalDateTime.now())
            .build();
        incomeRecordRepository.save(incomeRecord);
        
        // 更新专家收入
        updateExpertIncome(expertId, question.getBounty());
        
        return saved;
    }
    
    /**
     * 采纳答案（农户操作，专家查看）
     */
    public void adoptAnswer(String questionId, String answerId) {
        ExpertQuestion question = questionRepository.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("问题不存在"));
        
        ExpertAnswer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new EntityNotFoundException("答案不存在"));
        
        if (!answer.getQuestionId().equals(questionId)) {
            throw new IllegalArgumentException("答案不属于该问题");
        }
        
        // 更新答案状态
        answer.setIsAdopted(true);
        answerRepository.save(answer);
        
        // 更新问题状态
        question.setStatus(ExpertQuestion.QuestionStatus.ADOPTED);
        question.setAdoptedAnswerId(answerId);
        questionRepository.save(question);
        
        // 如果采纳有额外奖励，创建收入记录
        BigDecimal adoptionReward = BigDecimal.valueOf(20); // 假设采纳奖励20元
        ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
            .id(UUID.randomUUID().toString())
            .expertId(answer.getExpertId())
            .incomeType(ExpertIncomeRecord.IncomeType.ADOPTION)
            .sourceId(questionId)
            .amount(adoptionReward)
            .description("答案被采纳奖励")
            .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
            .settledAt(LocalDateTime.now())
            .build();
        incomeRecordRepository.save(incomeRecord);
        
        // 更新专家收入
        updateExpertIncome(answer.getExpertId(), adoptionReward);
    }
    
    /**
     * 更新专家收入
     */
    private void updateExpertIncome(String expertId, BigDecimal amount) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        profile.setTotalIncome(profile.getTotalIncome().add(amount));
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().add(amount));
        profileRepository.save(profile);
    }
}
### 6.3 ExpertAppointmentService (预约服务)

**路径**: `com.agriverse.expert.service.ExpertAppointmentService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExpertAppointmentService {
    private final ExpertAvailableSlotRepository slotRepository;
    private final ExpertAppointmentRepository appointmentRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    
    /**
     * 添加可用时段
     */
    public ExpertAvailableSlot addAvailableSlot(AvailableSlotRequest request, String expertId) {
        ExpertAvailableSlot slot = ExpertAvailableSlot.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .slotDate(request.getSlotDate())
            .timeSlot(request.getTimeSlot())
            .isAvailable(true)
            .isBooked(false)
            .build();
        
        return slotRepository.save(slot);
    }
    
    /**
     * 获取可用时段列表
     */
    public List<ExpertAvailableSlot> getAvailableSlots(String expertId, LocalDate startDate, LocalDate endDate) {
        return slotRepository.findAvailableSlotsInRange(expertId, startDate, endDate);
    }
    
    /**
     * 更新预约状态
     */
    public ExpertAppointment updateAppointmentStatus(AppointmentStatusUpdateRequest request, String expertId) {
        ExpertAppointment appointment = appointmentRepository.findById(request.getAppointmentId())
            .orElseThrow(() -> new EntityNotFoundException("预约不存在"));
        
        if (!appointment.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权操作此预约");
        }
        
        ExpertAppointment.AppointmentStatus newStatus = 
            ExpertAppointment.AppointmentStatus.valueOf(request.getStatus());
        
        appointment.setStatus(newStatus);
        if (request.getComment() != null) {
            appointment.setExpertComment(request.getComment());
        }
        
        ExpertAppointment saved = appointmentRepository.save(appointment);
        
        // 如果确认预约，更新时段状态
        if (newStatus == ExpertAppointment.AppointmentStatus.CONFIRMED && appointment.getSlotId() != null) {
            ExpertAvailableSlot slot = slotRepository.findById(appointment.getSlotId())
                .orElse(null);
            if (slot != null) {
                slot.setIsBooked(true);
                slotRepository.save(slot);
            }
        }
        
        // 如果完成预约，创建收入记录
        if (newStatus == ExpertAppointment.AppointmentStatus.COMPLETED) {
            ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
                .id(UUID.randomUUID().toString())
                .expertId(expertId)
                .incomeType(ExpertIncomeRecord.IncomeType.APPOINTMENT)
                .sourceId(appointment.getId())
                .amount(appointment.getAmount())
                .description("预约咨询收入")
                .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
                .settledAt(LocalDateTime.now())
                .build();
            incomeRecordRepository.save(incomeRecord);
            
            // 更新专家收入
            updateExpertIncome(expertId, appointment.getAmount());
        }
        
        return saved;
    }
    
    /**
     * 获取预约列表
     */
    public Page<ExpertAppointment> getAppointments(String expertId, String status, 
                                                   LocalDate startDate, LocalDate endDate,
                                                   Integer page, Integer size) {
        Specification<ExpertAppointment> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertAppointment.AppointmentStatus.valueOf(status)));
        }
        
        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("appointmentDate"), startDate, endDate));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "appointmentDate", "createdAt"));
        
        return appointmentRepository.findAll(spec, pageable);
    }
    
    private void updateExpertIncome(String expertId, BigDecimal amount) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        profile.setTotalIncome(profile.getTotalIncome().add(amount));
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().add(amount));
        profileRepository.save(profile);
    }
}
```

### 6.4 ExpertContentService (内容服务)

**路径**: `com.agriverse.expert.service.ExpertContentService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExpertContentService {
    private final ExpertContentRepository contentRepository;
    
    /**
     * 发布内容
     */
    public ExpertContent publishContent(ContentPublishRequest request, String expertId) {
        ExpertContent content = ExpertContent.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .contentType(ExpertContent.ContentType.valueOf(request.getContentType()))
            .title(request.getTitle())
            .summary(request.getSummary())
            .content(request.getContent())
            .coverUrl(request.getCoverUrl())
            .videoUrl(request.getVideoUrl())
            .images(request.getImages() != null ? 
                new ObjectMapper().writeValueAsString(request.getImages()) : null)
            .status(ExpertContent.ContentStatus.PUBLISHED)
            .auditStatus(ExpertContent.AuditStatus.PENDING)
            .publishedAt(LocalDateTime.now())
            .build();
        
        return contentRepository.save(content);
    }
    
    /**
     * 获取内容列表
     */
    public Page<ExpertContent> getContents(String expertId, String contentType, 
                                          String status, Integer page, Integer size) {
        Specification<ExpertContent> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (contentType != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("contentType"), 
                    ExpertContent.ContentType.valueOf(contentType)));
        }
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertContent.ContentStatus.valueOf(status)));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return contentRepository.findAll(spec, pageable);
    }
    
    /**
     * 删除内容
     */
    public void deleteContent(String contentId, String expertId) {
        ExpertContent content = contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("内容不存在"));
        
        if (!content.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权删除此内容");
        }
        
        contentRepository.delete(content);
    }
}
```

### 6.5 ExpertIncomeService (收入服务)

**路径**: `com.agriverse.expert.service.ExpertIncomeService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExpertIncomeService {
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final ExpertWithdrawalRepository withdrawalRepository;
    
    /**
     * 获取收入统计
     */
    public IncomeStatisticsResponse getIncomeStatistics(String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        BigDecimal qaIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.QA);
        
        BigDecimal appointmentIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.APPOINTMENT);
        
        BigDecimal adoptionIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.ADOPTION);
        
        BigDecimal totalIncome = profile.getTotalIncome();
        BigDecimal withdrawTotal = withdrawalRepository.getTotalWithdrawnAmount(expertId);
        BigDecimal withdrawableBalance = profile.getWithdrawableBalance();
        
        return IncomeStatisticsResponse.builder()
            .qaIncome(qaIncome != null ? qaIncome : BigDecimal.ZERO)
            .appointmentIncome(appointmentIncome != null ? appointmentIncome : BigDecimal.ZERO)
            .adoptionIncome(adoptionIncome != null ? adoptionIncome : BigDecimal.ZERO)
            .totalIncome(totalIncome)
            .withdrawTotal(withdrawTotal != null ? withdrawTotal : BigDecimal.ZERO)
            .withdrawableBalance(withdrawableBalance)
            .build();
    }
    
    /**
     * 获取收入明细
     */
    public Page<ExpertIncomeRecord> getIncomeRecords(String expertId, String incomeType,
                                                    LocalDateTime startTime, LocalDateTime endTime,
                                                    Integer page, Integer size) {
        Specification<ExpertIncomeRecord> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (incomeType != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("incomeType"), 
                    ExpertIncomeRecord.IncomeType.valueOf(incomeType)));
        }
        
        if (startTime != null && endTime != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("createdAt"), startTime, endTime));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return incomeRecordRepository.findAll(spec, pageable);
    }
    
    /**
     * 申请提现
     */
    public ExpertWithdrawal applyWithdrawal(WithdrawalRequest request, String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        if (profile.getWithdrawableBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("可提现余额不足");
        }
        
        ExpertWithdrawal withdrawal = ExpertWithdrawal.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .amount(request.getAmount())
            .bankAccount(request.getBankAccount())
            .accountName(request.getAccountName())
            .status(ExpertWithdrawal.WithdrawalStatus.PENDING)
            .build();
        
        ExpertWithdrawal saved = withdrawalRepository.save(withdrawal);
        
        // 更新可提现余额
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().subtract(request.getAmount()));
        profileRepository.save(profile);
        
        return saved;
    }
    
    /**
     * 获取提现记录
     */
    public Page<ExpertWithdrawal> getWithdrawals(String expertId, String status,
                                                Integer page, Integer size) {
        Specification<ExpertWithdrawal> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertWithdrawal.WithdrawalStatus.valueOf(status)));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return withdrawalRepository.findAll(spec, pageable);
    }
}
```

### 6.6 ExpertProfileService (专家资料服务)

**路径**: `com.agriverse.expert.service.ExpertProfileService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExpertProfileService {
    private final ExpertProfileRepository profileRepository;
    private final FarmerReviewRepository reviewRepository;
    
    /**
     * 获取专家资料
     */
    public ExpertProfile getExpertProfile(String expertId) {
        return profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
    }
    
    /**
     * 更新服务价格
     */
    public ExpertProfile updateServicePrice(ServicePriceUpdateRequest request, String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        if (request.getServicePrice() != null) {
            profile.setServicePrice(request.getServicePrice());
        }
        if (request.getQaPrice() != null) {
            profile.setQaPrice(request.getQaPrice());
        }
        
        return profileRepository.save(profile);
    }
    
    /**
     * 获取农户评价
     */
    public Page<FarmerReview> getFarmerReviews(String expertId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return reviewRepository.findByExpertId(expertId, pageable);
    }
    
    /**
     * 更新专家评分
     */
    public void updateExpertRating(String expertId) {
        BigDecimal averageRating = reviewRepository.getAverageRating(expertId);
        if (averageRating != null) {
            ExpertProfile profile = profileRepository.findByExpertId(expertId)
                .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
            profile.setRating(averageRating);
            profileRepository.save(profile);
        }
    }
}
```

---

## 7. Controller层

### 7.1 ExpertDashboardController (专家仪表盘控制器)

**路径**: `com.agriverse.expert.controller.ExpertDashboardController`

```java
@RestController
@RequestMapping("/api/expert/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家仪表盘", description = "专家数据统计和监控接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertDashboardController {
    private final ExpertDashboardService dashboardService;
    
    /**
     * 获取仪表盘统计数据
     */
    @Operation(summary = "获取仪表盘统计数据", description = "获取问答、预约、收入等统计数据")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ExpertDashboardStatisticsResponse>> getStatistics(Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertDashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取仪表盘统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.2 ExpertQAController (问答管理控制器)

**路径**: `com.agriverse.expert.controller.ExpertQAController`

```java
@RestController
@RequestMapping("/api/expert/qa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家问答管理", description = "问题回答和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertQAController {
    private final ExpertQAService qaService;
    
    /**
     * 搜索问题
     */
    @Operation(summary = "搜索问题", description = "根据关键词、状态等条件搜索问题")
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<ExpertQuestion>>> searchQuestions(
            @Valid @RequestBody QuestionSearchRequest request) {
        try {
            Page<ExpertQuestion> questions = qaService.searchQuestions(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", questions));
        } catch (Exception e) {
            log.error("搜索问题异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 回答问题
     */
    @Operation(summary = "回答问题", description = "专家回答问题")
    @PostMapping("/answer")
    public ResponseEntity<ApiResponse<ExpertAnswer>> answerQuestion(
            @Valid @RequestBody AnswerRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAnswer answer = qaService.answerQuestion(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("回答成功", answer));
        } catch (Exception e) {
            log.error("回答问题异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "回答失败，请稍后重试"));
        }
    }
}
```

### 7.3 ExpertAppointmentController (预约管理控制器)

**路径**: `com.agriverse.expert.controller.ExpertAppointmentController`

```java
@RestController
@RequestMapping("/api/expert/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家预约管理", description = "预约时段和预约记录管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertAppointmentController {
    private final ExpertAppointmentService appointmentService;
    
    /**
     * 添加可用时段
     */
    @Operation(summary = "添加可用时段", description = "设置可预约的时间段")
    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<ExpertAvailableSlot>> addAvailableSlot(
            @Valid @RequestBody AvailableSlotRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAvailableSlot slot = appointmentService.addAvailableSlot(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("添加成功", slot));
        } catch (Exception e) {
            log.error("添加可用时段异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 获取预约列表
     */
    @Operation(summary = "获取预约列表", description = "获取专家的预约记录列表")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpertAppointment>>> getAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertAppointment> appointments = appointmentService.getAppointments(
                expertId, status, startDate, endDate, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", appointments));
        } catch (Exception e) {
            log.error("获取预约列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新预约状态
     */
    @Operation(summary = "更新预约状态", description = "确认、取消或完成预约")
    @PutMapping("/status")
    public ResponseEntity<ApiResponse<ExpertAppointment>> updateAppointmentStatus(
            @Valid @RequestBody AppointmentStatusUpdateRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAppointment appointment = appointmentService.updateAppointmentStatus(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", appointment));
        } catch (Exception e) {
            log.error("更新预约状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
}
```

### 7.4 ExpertContentController (内容管理控制器)

**路径**: `com.agriverse.expert.controller.ExpertContentController`

```java
@RestController
@RequestMapping("/api/expert/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家内容管理", description = "内容发布和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertContentController {
    private final ExpertContentService contentService;
    
    /**
     * 发布内容
     */
    @Operation(summary = "发布内容", description = "发布文章、视频等内容")
    @PostMapping
    public ResponseEntity<ApiResponse<ExpertContent>> publishContent(
            @Valid @RequestBody ContentPublishRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertContent content = contentService.publishContent(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("发布成功", content));
        } catch (Exception e) {
            log.error("发布内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "发布失败，请稍后重试"));
        }
    }
    
    /**
     * 获取内容列表
     */
    @Operation(summary = "获取内容列表", description = "获取专家发布的内容列表")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpertContent>>> getContents(
            @RequestParam(required = false) String contentType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertContent> contents = contentService.getContents(
                expertId, contentType, status, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", contents));
        } catch (Exception e) {
            log.error("获取内容列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 删除内容
     */
    @Operation(summary = "删除内容", description = "删除指定的内容")
    @DeleteMapping("/{contentId}")
    public ResponseEntity<ApiResponse<Object>> deleteContent(
            @PathVariable String contentId,
            Principal principal) {
        try {
            String expertId = principal.getName();
            contentService.deleteContent(contentId, expertId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
}
```

### 7.5 ExpertIncomeController (收入管理控制器)

**路径**: `com.agriverse.expert.controller.ExpertIncomeController`

```java
@RestController
@RequestMapping("/api/expert/income")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家收入管理", description = "收入统计和提现管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertIncomeController {
    private final ExpertIncomeService incomeService;
    
    /**
     * 获取收入统计
     */
    @Operation(summary = "获取收入统计", description = "获取问答、预约等收入统计")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<IncomeStatisticsResponse>> getIncomeStatistics(Principal principal) {
        try {
            String expertId = principal.getName();
            IncomeStatisticsResponse statistics = incomeService.getIncomeStatistics(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取收入统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取收入明细
     */
    @Operation(summary = "获取收入明细", description = "获取收入记录列表")
    @GetMapping("/records")
    public ResponseEntity<ApiResponse<Page<ExpertIncomeRecord>>> getIncomeRecords(
            @RequestParam(required = false) String incomeType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertIncomeRecord> records = incomeService.getIncomeRecords(
                expertId, incomeType, startTime, endTime, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", records));
        } catch (Exception e) {
            log.error("获取收入明细异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 申请提现
     */
    @Operation(summary = "申请提现", description = "申请提现到银行账户")
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<ExpertWithdrawal>> applyWithdrawal(
            @Valid @RequestBody WithdrawalRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertWithdrawal withdrawal = incomeService.applyWithdrawal(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("申请成功", withdrawal));
        } catch (Exception e) {
            log.error("申请提现异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "申请失败，请稍后重试"));
        }
    }
    
    /**
     * 获取提现记录
     */
    @Operation(summary = "获取提现记录", description = "获取提现申请记录列表")
    @GetMapping("/withdrawals")
    public ResponseEntity<ApiResponse<Page<ExpertWithdrawal>>> getWithdrawals(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertWithdrawal> withdrawals = incomeService.getWithdrawals(
                expertId, status, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", withdrawals));
        } catch (Exception e) {
            log.error("获取提现记录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.6 ExpertProfileController (专家资料控制器)

**路径**: `com.agriverse.expert.controller.ExpertProfileController`

```java
@RestController
@RequestMapping("/api/expert/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家资料管理", description = "专家信息和服务价格管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertProfileController {
    private final ExpertProfileService profileService;
    
    /**
     * 获取专家资料
     */
    @Operation(summary = "获取专家资料", description = "获取专家详细信息")
    @GetMapping
    public ResponseEntity<ApiResponse<ExpertProfile>> getExpertProfile(Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertProfile profile = profileService.getExpertProfile(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", profile));
        } catch (Exception e) {
            log.error("获取专家资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新服务价格
     */
    @Operation(summary = "更新服务价格", description = "更新预约咨询和问答价格")
    @PutMapping("/price")
    public ResponseEntity<ApiResponse<ExpertProfile>> updateServicePrice(
            @Valid @RequestBody ServicePriceUpdateRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertProfile profile = profileService.updateServicePrice(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", profile));
        } catch (Exception e) {
            log.error("更新服务价格异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取农户评价
     */
    @Operation(summary = "获取农户评价", description = "获取农户对专家的评价列表")
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<Page<FarmerReview>>> getFarmerReviews(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<FarmerReview> reviews = profileService.getFarmerReviews(expertId, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", reviews));
        } catch (Exception e) {
            log.error("获取农户评价异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

---

## 8. 业务流程说明

### 8.1 问答管理流程

```
1. 农户提问
   ├─ 农户发布问题（带悬赏金额）
   ├─ 问题状态：待回答
   └─ 问题进入问答列表
   │
2. 专家回答
   ├─ 专家查看待回答问题列表
   ├─ 专家回答问题
   ├─ 创建答案记录
   ├─ 问题状态更新为：已回答
   ├─ 创建收入记录（问答奖励）
   └─ 更新专家收入
   │
3. 采纳答案
   ├─ 农户查看答案列表
   ├─ 农户采纳最佳答案
   ├─ 答案状态更新为：已采纳
   ├─ 问题状态更新为：已采纳
   ├─ 创建收入记录（采纳奖励）
   └─ 更新专家收入
```

### 8.2 预约管理流程

```
1. 设置可用时段
   ├─ 专家设置可预约日期和时间段
   ├─ 创建可用时段记录
   └─ 时段状态：可用、未预约
   │
2. 农户预约
   ├─ 农户查看专家可用时段
   ├─ 农户选择时段并提交预约
   ├─ 创建预约记录（状态：待确认）
   └─ 时段状态更新为：已预约
   │
3. 专家确认
   ├─ 专家查看预约请求
   ├─ 专家确认或拒绝预约
   ├─ 如果确认，预约状态更新为：已确认
   └─ 如果拒绝，时段状态恢复为：可用
   │
4. 完成预约
   ├─ 预约完成后，专家标记为已完成
   ├─ 创建收入记录（预约咨询收入）
   └─ 更新专家收入
```

### 8.3 内容发布流程

```
1. 内容创建
   ├─ 专家创建内容（文章/视频/图片）
   ├─ 填写标题、摘要、正文等
   ├─ 内容状态：草稿
   └─ 保存内容
   │
2. 内容发布
   ├─ 专家发布内容
   ├─ 内容状态更新为：已发布
   ├─ 审核状态：待审核
   └─ 记录发布时间
   │
3. 内容审核
   ├─ 管理员审核内容
   ├─ 审核通过：审核状态更新为：已通过
   └─ 审核拒绝：内容下架
```

### 8.4 收入管理流程

```
1. 收入产生
   ├─ 回答问题获得奖励
   ├─ 答案被采纳获得额外奖励
   ├─ 完成预约获得咨询费用
   ├─ 创建收入记录
   └─ 更新专家可提现余额
   │
2. 提现申请
   ├─ 专家申请提现
   ├─ 验证可提现余额
   ├─ 创建提现记录（状态：待处理）
   └─ 扣除可提现余额
   │
3. 提现处理
   ├─ 系统处理提现申请
   ├─ 提现状态更新为：处理中
   ├─ 转账到银行账户
   └─ 提现状态更新为：成功
```

---

## 9. API接口设计

### 9.1 专家仪表盘接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/expert/dashboard/statistics` | 获取仪表盘统计数据 | EXPERT |

### 9.2 问答管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/expert/qa/questions/search` | 搜索问题 | EXPERT |
| GET | `/api/expert/qa/questions/pending` | 获取待回答问题列表 | EXPERT |
| GET | `/api/expert/qa/questions/{questionId}` | 获取问题详情 | EXPERT |
| POST | `/api/expert/qa/answers` | 回答问题 | EXPERT |
| GET | `/api/expert/qa/answers/{answerId}` | 获取答案详情 | EXPERT |
| GET | `/api/expert/qa/my-answers` | 获取我的回答列表 | EXPERT |

### 9.3 预约管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/expert/appointments/slots` | 添加可预约时段 | EXPERT |
| GET | `/api/expert/appointments/slots` | 获取可用时段列表 | EXPERT |
| DELETE | `/api/expert/appointments/slots/{slotId}` | 删除时段 | EXPERT |
| GET | `/api/expert/appointments` | 获取预约列表 | EXPERT |
| GET | `/api/expert/appointments/{appointmentId}` | 获取预约详情 | EXPERT |
| PUT | `/api/expert/appointments/{appointmentId}/status` | 更新预约状态 | EXPERT |

### 9.4 知识发布接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/expert/contents` | 发布内容 | EXPERT |
| PUT | `/api/expert/contents/{contentId}` | 更新内容 | EXPERT |
| DELETE | `/api/expert/contents/{contentId}` | 删除内容 | EXPERT |
| GET | `/api/expert/contents` | 获取我的内容列表 | EXPERT |
| GET | `/api/expert/contents/{contentId}` | 获取内容详情 | EXPERT |
| PUT | `/api/expert/contents/{contentId}/status` | 更新内容状态 | EXPERT |

### 9.5 收入管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/expert/income/statistics` | 获取收入统计 | EXPERT |
| GET | `/api/expert/income/records` | 获取收入记录列表 | EXPERT |
| POST | `/api/expert/income/withdraw` | 申请提现 | EXPERT |
| GET | `/api/expert/income/withdrawals` | 获取提现记录列表 | EXPERT |
| GET | `/api/expert/income/withdrawals/{withdrawalId}` | 获取提现详情 | EXPERT |

### 9.6 服务价格设置接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| PUT | `/api/expert/profile/service-price` | 更新服务价格 | EXPERT |
| GET | `/api/expert/profile` | 获取专家信息 | EXPERT |
| PUT | `/api/expert/profile` | 更新专家信息 | EXPERT |

### 9.7 农户评价接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/expert/reviews` | 获取评价列表 | EXPERT |
| GET | `/api/expert/reviews/statistics` | 获取评价统计 | EXPERT |

### 9.8 响应格式

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
   - 执行 SQL 脚本创建所有表（专家信息表、问答表、答案表、预约时段表、预约记录表、专家内容表、收入记录表、提现记录表、农户评价表）
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

1. **实现 ExpertDashboardService**
   - 仪表盘统计数据计算
   - 趋势数据生成
   - 数据聚合逻辑

2. **实现 ExpertQAService**
   - 问题搜索功能
   - 回答问题功能
   - 答案采纳处理
   - 收入记录创建

3. **实现 ExpertAppointmentService**
   - 时段管理功能
   - 预约请求处理
   - 预约状态更新
   - 预约统计

4. **实现 ExpertContentService**
   - 内容发布功能
   - 内容编辑和删除
   - 内容状态管理
   - 内容统计

5. **实现 ExpertIncomeService**
   - 收入统计功能
   - 收入记录查询
   - 提现申请处理
   - 提现记录查询

6. **实现 ExpertProfileService**
   - 专家信息管理
   - 服务价格设置
   - 资质管理

### 10.3 第三阶段：Controller 层

1. **实现 ExpertDashboardController**
   - 仪表盘统计接口
   - 参数验证
   - 异常处理

2. **实现 ExpertQAController**
   - 问答相关接口
   - 问题搜索接口
   - 回答接口

3. **实现 ExpertAppointmentController**
   - 时段管理接口
   - 预约管理接口
   - 预约状态更新接口

4. **实现 ExpertContentController**
   - 内容发布接口
   - 内容管理接口
   - 内容状态更新接口

5. **实现 ExpertIncomeController**
   - 收入统计接口
   - 收入记录接口
   - 提现接口

6. **实现 ExpertProfileController**
   - 专家信息接口
   - 服务价格接口

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
- 回答问题时要同步更新问题状态和收入记录
- 预约确认时要同步更新时段状态
- 提现申请时要验证可提现余额并扣除

### 11.2 安全性

- 所有接口需要 JWT 认证
- 权限控制使用 `@PreAuthorize("hasRole('EXPERT')")`
- 专家只能操作自己的数据
- 敏感数据加密存储

### 11.3 性能考虑

- 大数据量查询使用分页
- 复杂计算考虑缓存（Redis）
- 收入统计可以使用定时任务计算
- 内容列表查询使用索引优化

### 11.4 异常处理

- 统一异常处理机制
- 友好的错误提示
- 记录异常日志
- 业务异常处理（如余额不足、问题已被回答等）

### 11.5 业务规则

- 问题状态流转验证（PENDING -> ANSWERED -> ADOPTED）
- 预约状态流转验证（PENDING -> CONFIRMED -> COMPLETED）
- 提现金额验证（不能超过可提现余额）
- 时段冲突验证（同一时段不能重复预约）

### 11.6 收入结算规则

- 回答问题立即结算奖励
- 答案被采纳获得额外奖励
- 预约完成时结算咨询费用
- 提现申请扣除可提现余额，等待处理

---

## 12. 扩展功能（后续实现）

1. **智能推荐**
   - 根据专家专业领域推荐相关问题
   - 根据农户问题推荐合适专家
   - 内容推荐算法

2. **消息通知**
   - 新问题通知
   - 预约请求通知
   - 收入到账通知
   - 提现结果通知

3. **数据分析**
   - 专家活跃度分析
   - 问答质量分析
   - 收入趋势分析
   - 预约完成率分析

4. **内容管理增强**
   - 内容分类管理
   - 内容标签系统
   - 内容搜索功能
   - 内容推荐算法

5. **评价系统增强**
   - 评价回复功能
   - 评价筛选和排序
   - 评价统计报表

6. **视频咨询**
   - 视频通话集成
   - 通话记录管理
   - 通话质量监控

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。
