# 银行其他功能后端实现流程文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 银行其他功能管理

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

### 1.1 银行仪表盘

1. **数据统计**
   - 今日放款统计（笔数、金额）
   - 在贷余额统计（笔数、金额）
   - 待审批申请数量
   - 风险预警数量（逾期融资）

2. **趋势分析**
   - 放款趋势图表（近6个月）
   - 在贷余额趋势图表
   - 审批通过率趋势

3. **快捷操作**
   - 快速跳转到审批列表
   - 快速跳转到逾期管理
   - 快速跳转到放款中心

### 1.2 客户管理

1. **客户信息管理**
   - 客户列表查询
   - 客户详情查看
   - 客户搜索（姓名、电话、地区）
   - 客户筛选（状态、地区、贷款次数）

2. **客户贷款记录**
   - 查看客户所有贷款记录
   - 贷款状态统计
   - 还款记录查看
   - 信用评分历史

3. **客户关系管理**
   - 客户标签管理
   - 客户备注管理
   - 客户联系记录
   - 客户跟进提醒

### 1.3 风控仪表盘

1. **风险指标监控**
   - 当前逾期率
   - 不良率
   - 授信余额
   - 联合贷占比

2. **风险趋势分析**
   - 逾期率趋势（近6个月）
   - 不良率趋势
   - 风险等级分布
   - 风险预警列表

3. **风险预警**
   - 高风险客户列表
   - 逾期客户预警
   - 信用评分下降预警
   - 异常行为预警

### 1.4 申请资料管理

1. **文件管理**
   - 申请资料上传记录
   - 文件类型分类（身份证、营业执照、财务报表等）
   - 文件大小统计
   - 文件上传时间记录

2. **文件下载**
   - 单个文件下载
   - 批量文件下载
   - 打包下载（ZIP格式）
   - 下载记录追踪

3. **文件审核**
   - 文件审核状态
   - 文件审核意见
   - 文件审核历史

### 1.5 银行信息管理

1. **银行基本信息**
   - 银行名称
   - 银行代码
   - 联系方式
   - 地址信息

2. **银行账户管理**
   - 银行账户列表
   - 账户余额查询
   - 账户交易记录

3. **银行配置管理**
   - 系统参数配置
   - 业务规则配置
   - 通知配置

---

## 2. 数据库设计

### 2.1 客户关系表 (bank_customer_relations)

```sql
CREATE TABLE IF NOT EXISTS bank_customer_relations (
    id VARCHAR(36) PRIMARY KEY COMMENT '关系ID',
    bank_id VARCHAR(36) NOT NULL COMMENT '银行ID',
    customer_id VARCHAR(36) NOT NULL COMMENT '客户ID（农户ID）',
    customer_name VARCHAR(100) COMMENT '客户姓名',
    customer_phone VARCHAR(20) COMMENT '客户电话',
    customer_location VARCHAR(200) COMMENT '客户地址',
    customer_type VARCHAR(20) DEFAULT 'FARMER' COMMENT '客户类型: FARMER-农户, ENTERPRISE-企业',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-活跃, INACTIVE-不活跃, BLACKLIST-黑名单',
    total_loans INT DEFAULT 0 COMMENT '累计贷款次数',
    total_amount DECIMAL(15,2) DEFAULT 0 COMMENT '累计贷款金额',
    current_loans INT DEFAULT 0 COMMENT '当前在途贷款数',
    current_amount DECIMAL(15,2) DEFAULT 0 COMMENT '当前在途金额',
    tags VARCHAR(500) COMMENT '客户标签（JSON格式）',
    notes TEXT COMMENT '备注信息',
    last_contact_at DATETIME COMMENT '最后联系时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_bank_id (bank_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_customer_name (customer_name),
    INDEX idx_customer_phone (customer_phone),
    FOREIGN KEY (customer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='银行客户关系表';
```

### 2.2 客户联系记录表 (customer_contact_records)

```sql
CREATE TABLE IF NOT EXISTS customer_contact_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    customer_relation_id VARCHAR(36) NOT NULL COMMENT '客户关系ID',
    contact_type VARCHAR(20) NOT NULL COMMENT '联系类型: PHONE-电话, EMAIL-邮件, VISIT-拜访, MEETING-会议',
    contact_date DATETIME NOT NULL COMMENT '联系日期',
    contact_person VARCHAR(100) COMMENT '联系人',
    contact_content TEXT COMMENT '联系内容',
    next_followup_date DATETIME COMMENT '下次跟进日期',
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_customer_relation_id (customer_relation_id),
    INDEX idx_contact_date (contact_date),
    FOREIGN KEY (customer_relation_id) REFERENCES bank_customer_relations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户联系记录表';
```

### 2.3 申请资料表 (application_documents)

```sql
CREATE TABLE IF NOT EXISTS application_documents (
    id VARCHAR(36) PRIMARY KEY COMMENT '资料ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    document_type VARCHAR(50) NOT NULL COMMENT '资料类型: ID_CARD-身份证, BUSINESS_LICENSE-营业执照, FINANCIAL_STATEMENT-财务报表, LAND_CONTRACT-土地合同, BANK_STATEMENT-银行流水, OTHER-其他',
    document_name VARCHAR(200) NOT NULL COMMENT '资料名称',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小（字节）',
    file_type VARCHAR(50) COMMENT '文件类型（MIME类型）',
    upload_status VARCHAR(20) NOT NULL DEFAULT 'UPLOADED' COMMENT '上传状态: UPLOADED-已上传, VERIFIED-已审核, REJECTED-已拒绝',
    verify_status VARCHAR(20) DEFAULT 'PENDING' COMMENT '审核状态: PENDING-待审核, APPROVED-已通过, REJECTED-已拒绝',
    verify_comment TEXT COMMENT '审核意见',
    verified_by VARCHAR(36) COMMENT '审核人ID',
    verified_at DATETIME COMMENT '审核时间',
    uploaded_by VARCHAR(36) COMMENT '上传人ID',
    uploaded_at DATETIME NOT NULL COMMENT '上传时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_document_type (document_type),
    INDEX idx_verify_status (verify_status),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='申请资料表';
```

### 2.4 银行信息表 (bank_info)

```sql
CREATE TABLE IF NOT EXISTS bank_info (
    id VARCHAR(36) PRIMARY KEY COMMENT '银行ID',
    bank_code VARCHAR(50) NOT NULL UNIQUE COMMENT '银行代码',
    bank_name VARCHAR(200) NOT NULL COMMENT '银行名称',
    bank_type VARCHAR(20) COMMENT '银行类型: COMMERCIAL-商业银行, AGRICULTURAL-农业银行, POLICY-政策性银行',
    contact_person VARCHAR(100) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_email VARCHAR(100) COMMENT '联系邮箱',
    address VARCHAR(500) COMMENT '地址',
    description TEXT COMMENT '银行描述',
    logo_url VARCHAR(500) COMMENT '银行Logo URL',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, INACTIVE-停用',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_bank_code (bank_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='银行信息表';
```

### 2.5 银行账户表 (bank_accounts)

```sql
CREATE TABLE IF NOT EXISTS bank_accounts (
    id VARCHAR(36) PRIMARY KEY COMMENT '账户ID',
    bank_id VARCHAR(36) NOT NULL COMMENT '银行ID',
    account_number VARCHAR(50) NOT NULL COMMENT '账户号码',
    account_name VARCHAR(200) NOT NULL COMMENT '账户名称',
    account_type VARCHAR(20) NOT NULL COMMENT '账户类型: SETTLEMENT-结算账户, OPERATION-运营账户, RESERVE-准备金账户',
    balance DECIMAL(15,2) DEFAULT 0 COMMENT '账户余额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, FROZEN-冻结, CLOSED-已关闭',
    remark TEXT COMMENT '备注',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_bank_id (bank_id),
    INDEX idx_account_number (account_number),
    INDEX idx_status (status),
    FOREIGN KEY (bank_id) REFERENCES bank_info(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='银行账户表';
```

### 2.6 风险指标记录表 (risk_indicators)

```sql
CREATE TABLE IF NOT EXISTS risk_indicators (
    id VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    indicator_date DATE NOT NULL COMMENT '指标日期',
    overdue_rate DECIMAL(5,2) COMMENT '逾期率（%）',
    bad_debt_rate DECIMAL(5,2) COMMENT '不良率（%）',
    credit_balance DECIMAL(15,2) COMMENT '授信余额（元）',
    joint_loan_ratio DECIMAL(5,2) COMMENT '联合贷占比（%）',
    total_loans INT COMMENT '总贷款笔数',
    total_amount DECIMAL(15,2) COMMENT '总贷款金额',
    overdue_loans INT COMMENT '逾期贷款笔数',
    overdue_amount DECIMAL(15,2) COMMENT '逾期金额',
    bad_debt_loans INT COMMENT '不良贷款笔数',
    bad_debt_amount DECIMAL(15,2) COMMENT '不良金额',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    UNIQUE KEY uk_indicator_date (indicator_date),
    INDEX idx_indicator_date (indicator_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='风险指标记录表';
```

### 2.7 银行系统配置表 (bank_system_config)

```sql
CREATE TABLE IF NOT EXISTS bank_system_config (
    id VARCHAR(36) PRIMARY KEY COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type VARCHAR(20) DEFAULT 'STRING' COMMENT '配置类型: STRING-字符串, NUMBER-数字, BOOLEAN-布尔, JSON-JSON对象',
    description VARCHAR(500) COMMENT '配置描述',
    category VARCHAR(50) COMMENT '配置分类: LOAN-贷款, RISK-风控, NOTIFICATION-通知, SYSTEM-系统',
    is_editable BOOLEAN DEFAULT TRUE COMMENT '是否可编辑',
    updated_by VARCHAR(36) COMMENT '更新人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_config_key (config_key),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='银行系统配置表';
```

---

## 3. 实体类设计

### 3.1 BankCustomerRelation (银行客户关系)

**路径**: `com.agriverse.bank.entity.BankCustomerRelation`

```java
@Entity
@Table(name = "bank_customer_relations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankCustomerRelation {
    @Id
    private String id;
    
    @Column(name = "bank_id", nullable = false, length = 36)
    private String bankId;
    
    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;
    
    @Column(name = "customer_name", length = 100)
    private String customerName;
    
    @Column(name = "customer_phone", length = 20)
    private String customerPhone;
    
    @Column(name = "customer_location", length = 200)
    private String customerLocation;
    
    @Column(name = "customer_type", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CustomerType customerType = CustomerType.FARMER;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RelationStatus status = RelationStatus.ACTIVE;
    
    @Column(name = "total_loans")
    @Builder.Default
    private Integer totalLoans = 0;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(name = "current_loans")
    @Builder.Default
    private Integer currentLoans = 0;
    
    @Column(name = "current_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentAmount = BigDecimal.ZERO;
    
    @Column(length = 500)
    private String tags; // JSON格式
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "last_contact_at")
    private LocalDateTime lastContactAt;
    
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
    
    public enum CustomerType {
        FARMER, ENTERPRISE
    }
    
    public enum RelationStatus {
        ACTIVE, INACTIVE, BLACKLIST
    }
}
```

### 3.2 CustomerContactRecord (客户联系记录)

**路径**: `com.agriverse.bank.entity.CustomerContactRecord`

```java
@Entity
@Table(name = "customer_contact_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerContactRecord {
    @Id
    private String id;
    
    @Column(name = "customer_relation_id", nullable = false, length = 36)
    private String customerRelationId;
    
    @Column(name = "contact_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContactType contactType;
    
    @Column(name = "contact_date", nullable = false)
    private LocalDateTime contactDate;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "contact_content", columnDefinition = "TEXT")
    private String contactContent;
    
    @Column(name = "next_followup_date")
    private LocalDateTime nextFollowupDate;
    
    @Column(name = "created_by", length = 36)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum ContactType {
        PHONE, EMAIL, VISIT, MEETING
    }
}
```

### 3.3 ApplicationDocument (申请资料)

**路径**: `com.agriverse.bank.entity.ApplicationDocument`

```java
@Entity
@Table(name = "application_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "document_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    
    @Column(name = "document_name", nullable = false, length = 200)
    private String documentName;
    
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type", length = 50)
    private String fileType;
    
    @Column(name = "upload_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UploadStatus uploadStatus = UploadStatus.UPLOADED;
    
    @Column(name = "verify_status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerifyStatus verifyStatus = VerifyStatus.PENDING;
    
    @Column(name = "verify_comment", columnDefinition = "TEXT")
    private String verifyComment;
    
    @Column(name = "verified_by", length = 36)
    private String verifiedBy;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "uploaded_by", length = 36)
    private String uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum DocumentType {
        ID_CARD,           // 身份证
        BUSINESS_LICENSE,  // 营业执照
        FINANCIAL_STATEMENT, // 财务报表
        LAND_CONTRACT,     // 土地合同
        BANK_STATEMENT,    // 银行流水
        OTHER              // 其他
    }
    
    public enum UploadStatus {
        UPLOADED, VERIFIED, REJECTED
    }
    
    public enum VerifyStatus {
        PENDING, APPROVED, REJECTED
    }
}
```

### 3.4 BankInfo (银行信息)

**路径**: `com.agriverse.bank.entity.BankInfo`

```java
@Entity
@Table(name = "bank_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankInfo {
    @Id
    private String id;
    
    @Column(name = "bank_code", nullable = false, unique = true, length = 50)
    private String bankCode;
    
    @Column(name = "bank_name", nullable = false, length = 200)
    private String bankName;
    
    @Column(name = "bank_type", length = 20)
    @Enumerated(EnumType.STRING)
    private BankType bankType;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;
    
    @Column(name = "contact_email", length = 100)
    private String contactEmail;
    
    @Column(length = 500)
    private String address;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BankStatus status = BankStatus.ACTIVE;
    
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
    
    public enum BankType {
        COMMERCIAL, AGRICULTURAL, POLICY
    }
    
    public enum BankStatus {
        ACTIVE, INACTIVE
    }
}
```

### 3.5 BankAccount (银行账户)

**路径**: `com.agriverse.bank.entity.BankAccount`

```java
@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {
    @Id
    private String id;
    
    @Column(name = "bank_id", nullable = false, length = 36)
    private String bankId;
    
    @Column(name = "account_number", nullable = false, length = 50)
    private String accountNumber;
    
    @Column(name = "account_name", nullable = false, length = 200)
    private String accountName;
    
    @Column(name = "account_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AccountType accountType;
    
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;
    
    @Column(length = 10)
    @Builder.Default
    private String currency = "CNY";
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;
    
    @Column(columnDefinition = "TEXT")
    private String remark;
    
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
    
    public enum AccountType {
        SETTLEMENT, OPERATION, RESERVE
    }
    
    public enum AccountStatus {
        ACTIVE, FROZEN, CLOSED
    }
}
```

### 3.6 RiskIndicator (风险指标)

**路径**: `com.agriverse.bank.entity.RiskIndicator`

```java
@Entity
@Table(name = "risk_indicators")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskIndicator {
    @Id
    private String id;
    
    @Column(name = "indicator_date", nullable = false, unique = true)
    private LocalDate indicatorDate;
    
    @Column(name = "overdue_rate", precision = 5, scale = 2)
    private BigDecimal overdueRate;
    
    @Column(name = "bad_debt_rate", precision = 5, scale = 2)
    private BigDecimal badDebtRate;
    
    @Column(name = "credit_balance", precision = 15, scale = 2)
    private BigDecimal creditBalance;
    
    @Column(name = "joint_loan_ratio", precision = 5, scale = 2)
    private BigDecimal jointLoanRatio;
    
    @Column(name = "total_loans")
    private Integer totalLoans;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "overdue_loans")
    private Integer overdueLoans;
    
    @Column(name = "overdue_amount", precision = 15, scale = 2)
    private BigDecimal overdueAmount;
    
    @Column(name = "bad_debt_loans")
    private Integer badDebtLoans;
    
    @Column(name = "bad_debt_amount", precision = 15, scale = 2)
    private BigDecimal badDebtAmount;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 3.7 BankSystemConfig (银行系统配置)

**路径**: `com.agriverse.bank.entity.BankSystemConfig`

```java
@Entity
@Table(name = "bank_system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankSystemConfig {
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

---

## 4. DTO设计

### 4.1 仪表盘相关DTO

#### 4.1.1 DashboardStatisticsResponse (仪表盘统计响应)

**路径**: `com.agriverse.bank.dto.DashboardStatisticsResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatisticsResponse {
    private Integer todayDisbursedCount;      // 今日放款笔数
    private BigDecimal todayDisbursedAmount;  // 今日放款金额
    private Integer outstandingLoansCount;     // 在贷余额笔数
    private BigDecimal outstandingAmount;      // 在贷余额金额
    private Integer pendingApprovalsCount;     // 待审批数量
    private Integer overdueLoansCount;         // 逾期融资数量
    private List<TrendData> disbursementTrend; // 放款趋势
    private List<TrendData> balanceTrend;      // 余额趋势
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    private String name;  // 月份或日期
    private BigDecimal value; // 数值
}
```

### 4.2 客户管理相关DTO

#### 4.2.1 CustomerSearchRequest (客户搜索请求)

**路径**: `com.agriverse.bank.dto.CustomerSearchRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSearchRequest {
    private String keyword;      // 搜索关键词（姓名、电话）
    private String status;        // 状态筛选
    private String location;      // 地区筛选
    private Integer minLoans;     // 最小贷款次数
    private Integer maxLoans;     // 最大贷款次数
    private Integer page = 0;
    private Integer size = 20;
}
```

#### 4.2.2 CustomerDetailResponse (客户详情响应)

**路径**: `com.agriverse.bank.dto.CustomerDetailResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDetailResponse {
    private String id;
    private String customerId;
    private String customerName;
    private String customerPhone;
    private String customerLocation;
    private String customerType;
    private String status;
    private Integer totalLoans;
    private BigDecimal totalAmount;
    private Integer currentLoans;
    private BigDecimal currentAmount;
    private List<String> tags;
    private String notes;
    private LocalDateTime lastContactAt;
    private List<FinancingApplication> loanHistory; // 贷款历史
    private List<CreditScore> creditHistory;        // 信用评分历史
    private List<CustomerContactRecord> contactRecords; // 联系记录
}
```

#### 4.2.3 CustomerContactRequest (客户联系请求)

**路径**: `com.agriverse.bank.dto.CustomerContactRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerContactRequest {
    @NotBlank(message = "客户关系ID不能为空")
    private String customerRelationId;
    
    @NotBlank(message = "联系类型不能为空")
    private String contactType; // PHONE, EMAIL, VISIT, MEETING
    
    @NotNull(message = "联系日期不能为空")
    private LocalDateTime contactDate;
    
    private String contactPerson;
    
    @NotBlank(message = "联系内容不能为空")
    private String contactContent;
    
    private LocalDateTime nextFollowupDate;
}
```

### 4.3 风控相关DTO

#### 4.3.1 RiskDashboardResponse (风控仪表盘响应)

**路径**: `com.agriverse.bank.dto.RiskDashboardResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskDashboardResponse {
    private BigDecimal currentOverdueRate;    // 当前逾期率
    private BigDecimal badDebtRate;           // 不良率
    private BigDecimal creditBalance;         // 授信余额
    private BigDecimal jointLoanRatio;         // 联合贷占比
    private List<TrendData> overdueRateTrend;  // 逾期率趋势
    private List<TrendData> badDebtRateTrend;  // 不良率趋势
    private List<RiskAlert> riskAlerts;        // 风险预警列表
}
```

#### 4.3.2 RiskAlert (风险预警)

**路径**: `com.agriverse.bank.dto.RiskAlert`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAlert {
    private String id;
    private String alertType;      // HIGH_RISK, OVERDUE, CREDIT_DOWN, ABNORMAL
    private String alertLevel;     // LOW, MEDIUM, HIGH, CRITICAL
    private String customerId;
    private String customerName;
    private String financingId;
    private String description;
    private LocalDateTime alertTime;
}
```

### 4.4 申请资料相关DTO

#### 4.4.1 DocumentUploadRequest (资料上传请求)

**路径**: `com.agriverse.bank.dto.DocumentUploadRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentUploadRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "资料类型不能为空")
    private String documentType;
    
    @NotBlank(message = "资料名称不能为空")
    private String documentName;
    
    @NotBlank(message = "文件URL不能为空")
    private String fileUrl;
    
    private Long fileSize;
    private String fileType;
}
```

#### 4.4.2 DocumentVerifyRequest (资料审核请求)

**路径**: `com.agriverse.bank.dto.DocumentVerifyRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentVerifyRequest {
    @NotBlank(message = "资料ID不能为空")
    private String documentId;
    
    @NotBlank(message = "审核结果不能为空")
    private String verifyStatus; // APPROVED, REJECTED
    
    private String verifyComment; // 审核意见
}
```

### 4.5 银行信息相关DTO

#### 4.5.1 BankInfoRequest (银行信息请求)

**路径**: `com.agriverse.bank.dto.BankInfoRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankInfoRequest {
    @NotBlank(message = "银行代码不能为空")
    private String bankCode;
    
    @NotBlank(message = "银行名称不能为空")
    private String bankName;
    
    private String bankType;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private String address;
    private String description;
    private String logoUrl;
}
```

#### 4.5.2 BankAccountRequest (银行账户请求)

**路径**: `com.agriverse.bank.dto.BankAccountRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountRequest {
    @NotBlank(message = "银行ID不能为空")
    private String bankId;
    
    @NotBlank(message = "账户号码不能为空")
    private String accountNumber;
    
    @NotBlank(message = "账户名称不能为空")
    private String accountName;
    
    @NotBlank(message = "账户类型不能为空")
    private String accountType; // SETTLEMENT, OPERATION, RESERVE
    
    private String currency;
    private String remark;
}
```

---

## 5. Repository层

### 5.1 BankCustomerRelationRepository

**路径**: `com.agriverse.bank.repository.BankCustomerRelationRepository`

```java
@Repository
public interface BankCustomerRelationRepository extends JpaRepository<BankCustomerRelation, String> {
    List<BankCustomerRelation> findByBankId(String bankId);
    
    Optional<BankCustomerRelation> findByBankIdAndCustomerId(String bankId, String customerId);
    
    @Query("SELECT r FROM BankCustomerRelation r WHERE r.bankId = :bankId " +
           "AND (r.customerName LIKE %:keyword% OR r.customerPhone LIKE %:keyword%)")
    List<BankCustomerRelation> searchByKeyword(@Param("bankId") String bankId, 
                                                @Param("keyword") String keyword);
    
    List<BankCustomerRelation> findByBankIdAndStatus(String bankId, 
                                                     BankCustomerRelation.RelationStatus status);
    
    @Query("SELECT COUNT(r) FROM BankCustomerRelation r WHERE r.bankId = :bankId " +
           "AND r.status = 'ACTIVE'")
    Long countActiveCustomers(@Param("bankId") String bankId);
}
```

### 5.2 CustomerContactRecordRepository

**路径**: `com.agriverse.bank.repository.CustomerContactRecordRepository`

```java
@Repository
public interface CustomerContactRecordRepository extends JpaRepository<CustomerContactRecord, String> {
    List<CustomerContactRecord> findByCustomerRelationIdOrderByContactDateDesc(String customerRelationId);
    
    @Query("SELECT r FROM CustomerContactRecord r WHERE r.customerRelationId = :relationId " +
           "AND r.contactDate >= :startDate AND r.contactDate <= :endDate")
    List<CustomerContactRecord> findByDateRange(@Param("relationId") String relationId,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
}
```

### 5.3 ApplicationDocumentRepository

**路径**: `com.agriverse.bank.repository.ApplicationDocumentRepository`

```java
@Repository
public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, String> {
    List<ApplicationDocument> findByFinancingId(String financingId);
    
    List<ApplicationDocument> findByFinancingIdAndDocumentType(String financingId, 
                                                                ApplicationDocument.DocumentType documentType);
    
    List<ApplicationDocument> findByFinancingIdAndVerifyStatus(String financingId,
                                                                ApplicationDocument.VerifyStatus verifyStatus);
    
    @Query("SELECT SUM(d.fileSize) FROM ApplicationDocument d WHERE d.financingId = :financingId")
    Long getTotalFileSize(@Param("financingId") String financingId);
}
```

### 5.4 BankInfoRepository

**路径**: `com.agriverse.bank.repository.BankInfoRepository`

```java
@Repository
public interface BankInfoRepository extends JpaRepository<BankInfo, String> {
    Optional<BankInfo> findByBankCode(String bankCode);
    
    List<BankInfo> findByStatus(BankInfo.BankStatus status);
}
```

### 5.5 BankAccountRepository

**路径**: `com.agriverse.bank.repository.BankAccountRepository`

```java
@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    List<BankAccount> findByBankId(String bankId);
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    
    List<BankAccount> findByBankIdAndStatus(String bankId, BankAccount.AccountStatus status);
}
```

### 5.6 RiskIndicatorRepository

**路径**: `com.agriverse.bank.repository.RiskIndicatorRepository`

```java
@Repository
public interface RiskIndicatorRepository extends JpaRepository<RiskIndicator, String> {
    Optional<RiskIndicator> findByIndicatorDate(LocalDate date);
    
    @Query("SELECT r FROM RiskIndicator r WHERE r.indicatorDate >= :startDate " +
           "AND r.indicatorDate <= :endDate ORDER BY r.indicatorDate ASC")
    List<RiskIndicator> findByDateRange(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM RiskIndicator r ORDER BY r.indicatorDate DESC LIMIT 1")
    Optional<RiskIndicator> findLatest();
}
```

### 5.7 BankSystemConfigRepository

**路径**: `com.agriverse.bank.repository.BankSystemConfigRepository`

```java
@Repository
public interface BankSystemConfigRepository extends JpaRepository<BankSystemConfig, String> {
    Optional<BankSystemConfig> findByConfigKey(String configKey);
    
    List<BankSystemConfig> findByCategory(String category);
    
    List<BankSystemConfig> findByCategoryAndIsEditable(String category, Boolean isEditable);
}
```

---

## 6. Service层

### 6.1 BankDashboardService (银行仪表盘服务)

**路径**: `com.agriverse.bank.service.BankDashboardService`

```java
@Service
@RequiredArgsConstructor
public class BankDashboardService {
    private final FinancingApplicationRepository applicationRepository;
    private final DisbursementRepository disbursementRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public DashboardStatisticsResponse getDashboardStatistics(String bankId) {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        
        // 今日放款统计
        List<Disbursement> todayDisbursements = disbursementRepository
            .findByStatusAndDisbursedAtBetween(
                Disbursement.DisbursementStatus.SUCCESS,
                todayStart, todayEnd);
        
        int todayDisbursedCount = todayDisbursements.size();
        BigDecimal todayDisbursedAmount = todayDisbursements.stream()
            .map(Disbursement::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 在贷余额统计
        List<FinancingApplication> outstandingApplications = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        int outstandingLoansCount = outstandingApplications.size();
        BigDecimal outstandingAmount = outstandingApplications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 待审批数量
        long pendingApprovalsCount = applicationRepository
            .countByStatus(FinancingApplication.FinancingStatus.APPLIED);
        
        // 逾期融资数量
        LocalDate now = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findOverdueSchedules(now);
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        int overdueLoansCount = overdueFinancingIds.size();
        
        // 趋势数据（近6个月）
        List<TrendData> disbursementTrend = getDisbursementTrend(6);
        List<TrendData> balanceTrend = getBalanceTrend(6);
        
        return DashboardStatisticsResponse.builder()
            .todayDisbursedCount(todayDisbursedCount)
            .todayDisbursedAmount(todayDisbursedAmount)
            .outstandingLoansCount(outstandingLoansCount)
            .outstandingAmount(outstandingAmount)
            .pendingApprovalsCount((int) pendingApprovalsCount)
            .overdueLoansCount(overdueLoansCount)
            .disbursementTrend(disbursementTrend)
            .balanceTrend(balanceTrend)
            .build();
    }
    
    /**
     * 获取放款趋势
     */
    private List<TrendData> getDisbursementTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<Disbursement> disbursements = disbursementRepository
                .findByStatusAndDisbursedAtBetween(
                    Disbursement.DisbursementStatus.SUCCESS,
                    monthStart.atStartOfDay(),
                    monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = disbursements.stream()
                .map(Disbursement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取余额趋势
     */
    private List<TrendData> getBalanceTrend(int months) {
        // 类似实现，计算每月末的在贷余额
        // ...
        return new ArrayList<>();
    }
}
```

### 6.2 BankCustomerService (银行客户服务)

**路径**: `com.agriverse.bank.service.BankCustomerService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class BankCustomerService {
    private final BankCustomerRelationRepository relationRepository;
    private final CustomerContactRecordRepository contactRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final CreditScoreRepository creditScoreRepository;
    private final UserRepository userRepository;
    
    /**
     * 搜索客户
     */
    public Page<BankCustomerRelation> searchCustomers(CustomerSearchRequest request, String bankId) {
        Specification<BankCustomerRelation> spec = Specification.where(null);
        
        spec = spec.and((root, query, cb) -> cb.equal(root.get("bankId"), bankId));
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("customerName"), keyword),
                cb.like(root.get("customerPhone"), keyword)
            ));
        }
        
        if (request.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    BankCustomerRelation.RelationStatus.valueOf(request.getStatus())));
        }
        
        if (request.getLocation() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.like(root.get("customerLocation"), "%" + request.getLocation() + "%"));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "updatedAt"));
        
        return relationRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取客户详情
     */
    public CustomerDetailResponse getCustomerDetail(String relationId) {
        BankCustomerRelation relation = relationRepository.findById(relationId)
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        // 获取贷款历史
        List<FinancingApplication> loanHistory = applicationRepository
            .findByFarmerId(relation.getCustomerId());
        
        // 获取信用评分历史
        List<CreditScore> creditHistory = creditScoreRepository
            .findByFarmerIdOrderByCreatedAtDesc(relation.getCustomerId());
        
        // 获取联系记录
        List<CustomerContactRecord> contactRecords = contactRepository
            .findByCustomerRelationIdOrderByContactDateDesc(relationId);
        
        return CustomerDetailResponse.builder()
            .id(relation.getId())
            .customerId(relation.getCustomerId())
            .customerName(relation.getCustomerName())
            .customerPhone(relation.getCustomerPhone())
            .customerLocation(relation.getCustomerLocation())
            .customerType(relation.getCustomerType().name())
            .status(relation.getStatus().name())
            .totalLoans(relation.getTotalLoans())
            .totalAmount(relation.getTotalAmount())
            .currentLoans(relation.getCurrentLoans())
            .currentAmount(relation.getCurrentAmount())
            .tags(parseTags(relation.getTags()))
            .notes(relation.getNotes())
            .lastContactAt(relation.getLastContactAt())
            .loanHistory(loanHistory)
            .creditHistory(creditHistory)
            .contactRecords(contactRecords)
            .build();
    }
    
    /**
     * 添加客户联系记录
     */
    public CustomerContactRecord addContactRecord(CustomerContactRequest request, String createdBy) {
        BankCustomerRelation relation = relationRepository.findById(request.getCustomerRelationId())
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        CustomerContactRecord record = CustomerContactRecord.builder()
            .id(UUID.randomUUID().toString())
            .customerRelationId(request.getCustomerRelationId())
            .contactType(CustomerContactRecord.ContactType.valueOf(request.getContactType()))
            .contactDate(request.getContactDate())
            .contactPerson(request.getContactPerson())
            .contactContent(request.getContactContent())
            .nextFollowupDate(request.getNextFollowupDate())
            .createdBy(createdBy)
            .build();
        
        CustomerContactRecord saved = contactRepository.save(record);
        
        // 更新最后联系时间
        relation.setLastContactAt(request.getContactDate());
        relationRepository.save(relation);
        
        return saved;
    }
    
    /**
     * 更新客户信息
     */
    public BankCustomerRelation updateCustomer(String relationId, String tags, String notes) {
        BankCustomerRelation relation = relationRepository.findById(relationId)
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        if (tags != null) {
            relation.setTags(tags);
        }
        if (notes != null) {
            relation.setNotes(notes);
        }
        
        return relationRepository.save(relation);
    }
    
    /**
     * 同步客户数据（从融资申请中）
     */
    @Transactional
    public void syncCustomerData(String bankId, String customerId) {
        Optional<BankCustomerRelation> relationOpt = relationRepository
            .findByBankIdAndCustomerId(bankId, customerId);
        
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new EntityNotFoundException("客户不存在"));
        
        List<FinancingApplication> applications = applicationRepository
            .findByFarmerId(customerId);
        
        int totalLoans = applications.size();
        BigDecimal totalAmount = applications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long currentLoans = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .count();
        
        BigDecimal currentAmount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BankCustomerRelation relation = relationOpt.orElse(BankCustomerRelation.builder()
            .id(UUID.randomUUID().toString())
            .bankId(bankId)
            .customerId(customerId)
            .customerName(customer.getName() != null ? customer.getName() : customer.getPhone())
            .customerPhone(customer.getPhone())
            .customerLocation(customer.getAddress())
            .build());
        
        relation.setTotalLoans(totalLoans);
        relation.setTotalAmount(totalAmount);
        relation.setCurrentLoans((int) currentLoans);
        relation.setCurrentAmount(currentAmount);
        
        relationRepository.save(relation);
    }
    
    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return new ObjectMapper().readValue(tagsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
```

### 6.3 RiskManagementService (风险管理服务)

**路径**: `com.agriverse.bank.service.RiskManagementService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class RiskManagementService {
    private final RiskIndicatorRepository indicatorRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final CreditScoreRepository creditScoreRepository;
    
    /**
     * 获取风控仪表盘数据
     */
    public RiskDashboardResponse getRiskDashboard() {
        // 获取最新风险指标
        RiskIndicator latest = indicatorRepository.findLatest()
            .orElseGet(() -> calculateCurrentRiskIndicator());
        
        // 获取趋势数据（近6个月）
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);
        List<RiskIndicator> indicators = indicatorRepository
            .findByDateRange(startDate, endDate);
        
        List<TrendData> overdueRateTrend = indicators.stream()
            .map(i -> new TrendData(
                i.getIndicatorDate().format(DateTimeFormatter.ofPattern("M月")),
                i.getOverdueRate()
            ))
            .collect(Collectors.toList());
        
        List<TrendData> badDebtRateTrend = indicators.stream()
            .map(i -> new TrendData(
                i.getIndicatorDate().format(DateTimeFormatter.ofPattern("M月")),
                i.getBadDebtRate()
            ))
            .collect(Collectors.toList());
        
        // 获取风险预警
        List<RiskAlert> riskAlerts = getRiskAlerts();
        
        return RiskDashboardResponse.builder()
            .currentOverdueRate(latest.getOverdueRate())
            .badDebtRate(latest.getBadDebtRate())
            .creditBalance(latest.getCreditBalance())
            .jointLoanRatio(latest.getJointLoanRatio())
            .overdueRateTrend(overdueRateTrend)
            .badDebtRateTrend(badDebtRateTrend)
            .riskAlerts(riskAlerts)
            .build();
    }
    
    /**
     * 计算当前风险指标
     */
    @Scheduled(cron = "0 0 1 * * ?") // 每天凌晨1点执行
    public void calculateDailyRiskIndicator() {
        LocalDate today = LocalDate.now();
        
        // 检查是否已计算
        if (indicatorRepository.findByIndicatorDate(today).isPresent()) {
            return;
        }
        
        RiskIndicator indicator = calculateCurrentRiskIndicator();
        indicator.setIndicatorDate(today);
        indicator.setId(UUID.randomUUID().toString());
        indicatorRepository.save(indicator);
    }
    
    private RiskIndicator calculateCurrentRiskIndicator() {
        // 获取所有在途贷款
        List<FinancingApplication> activeLoans = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        int totalLoans = activeLoans.size();
        BigDecimal totalAmount = activeLoans.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository
            .findOverdueSchedules(today);
        
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        
        int overdueLoans = overdueFinancingIds.size();
        BigDecimal overdueAmount = overdueSchedules.stream()
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算逾期率
        BigDecimal overdueRate = totalAmount.compareTo(BigDecimal.ZERO) > 0 ?
            overdueAmount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        // 计算不良率（假设逾期90天以上为不良）
        long badDebtDays = 90;
        LocalDate badDebtDate = today.minusDays(badDebtDays);
        int badDebtLoans = (int) overdueSchedules.stream()
            .filter(s -> s.getDueDate().isBefore(badDebtDate))
            .map(RepaymentSchedule::getFinancingId)
            .distinct()
            .count();
        
        BigDecimal badDebtAmount = overdueSchedules.stream()
            .filter(s -> s.getDueDate().isBefore(badDebtDate))
            .map(s -> s.getPrincipal().add(s.getInterest()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal badDebtRate = totalAmount.compareTo(BigDecimal.ZERO) > 0 ?
            badDebtAmount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        // 计算联合贷占比
        long jointLoanCount = activeLoans.stream()
            .filter(a -> a.getProductId() != null) // 假设有productId的是联合贷
            .count();
        
        BigDecimal jointLoanRatio = totalLoans > 0 ?
            BigDecimal.valueOf(jointLoanCount)
                .divide(BigDecimal.valueOf(totalLoans), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)) :
            BigDecimal.ZERO;
        
        return RiskIndicator.builder()
            .totalLoans(totalLoans)
            .totalAmount(totalAmount)
            .overdueLoans(overdueLoans)
            .overdueAmount(overdueAmount)
            .overdueRate(overdueRate)
            .badDebtLoans(badDebtLoans)
            .badDebtAmount(badDebtAmount)
            .badDebtRate(badDebtRate)
            .creditBalance(totalAmount)
            .jointLoanRatio(jointLoanRatio)
            .build();
    }
    
    /**
     * 获取风险预警列表
     */
    private List<RiskAlert> getRiskAlerts() {
        List<RiskAlert> alerts = new ArrayList<>();
        
        // 高风险客户预警
        List<CreditScore> lowCreditScores = creditScoreRepository.findAll().stream()
            .filter(cs -> cs.getTotalScore() < 60)
            .collect(Collectors.toList());
        
        for (CreditScore cs : lowCreditScores) {
            alerts.add(RiskAlert.builder()
                .id(UUID.randomUUID().toString())
                .alertType("HIGH_RISK")
                .alertLevel("HIGH")
                .customerId(cs.getFarmerId())
                .description("客户信用评分低于60分")
                .alertTime(LocalDateTime.now())
                .build());
        }
        
        // 逾期预警
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        Set<String> overdueFinancingIds = overdueSchedules.stream()
            .map(RepaymentSchedule::getFinancingId)
            .collect(Collectors.toSet());
        
        for (String financingId : overdueFinancingIds) {
            FinancingApplication application = applicationRepository.findById(financingId)
                .orElse(null);
            if (application != null) {
                alerts.add(RiskAlert.builder()
                    .id(UUID.randomUUID().toString())
                    .alertType("OVERDUE")
                    .alertLevel("MEDIUM")
                    .customerId(application.getFarmerId())
                    .financingId(financingId)
                    .description("融资申请存在逾期还款")
                    .alertTime(LocalDateTime.now())
                    .build());
            }
        }
        
        return alerts;
    }
}
```

### 6.4 ApplicationDocumentService (申请资料服务)

**路径**: `com.agriverse.bank.service.ApplicationDocumentService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationDocumentService {
    private final ApplicationDocumentRepository documentRepository;
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 上传申请资料
     */
    public ApplicationDocument uploadDocument(DocumentUploadRequest request, String uploadedBy) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        ApplicationDocument document = ApplicationDocument.builder()
            .id(UUID.randomUUID().toString())
            .financingId(request.getFinancingId())
            .documentType(ApplicationDocument.DocumentType.valueOf(request.getDocumentType()))
            .documentName(request.getDocumentName())
            .fileUrl(request.getFileUrl())
            .fileSize(request.getFileSize())
            .fileType(request.getFileType())
            .uploadStatus(ApplicationDocument.UploadStatus.UPLOADED)
            .verifyStatus(ApplicationDocument.VerifyStatus.PENDING)
            .uploadedBy(uploadedBy)
            .uploadedAt(LocalDateTime.now())
            .build();
        
        return documentRepository.save(document);
    }
    
    /**
     * 审核资料
     */
    public ApplicationDocument verifyDocument(DocumentVerifyRequest request, String verifiedBy) {
        ApplicationDocument document = documentRepository.findById(request.getDocumentId())
            .orElseThrow(() -> new EntityNotFoundException("资料不存在"));
        
        document.setVerifyStatus(ApplicationDocument.VerifyStatus.valueOf(request.getVerifyStatus()));
        document.setVerifyComment(request.getVerifyComment());
        document.setVerifiedBy(verifiedBy);
        document.setVerifiedAt(LocalDateTime.now());
        
        if (ApplicationDocument.VerifyStatus.APPROVED.name().equals(request.getVerifyStatus())) {
            document.setUploadStatus(ApplicationDocument.UploadStatus.VERIFIED);
        } else if (ApplicationDocument.VerifyStatus.REJECTED.name().equals(request.getVerifyStatus())) {
            document.setUploadStatus(ApplicationDocument.UploadStatus.REJECTED);
        }
        
        return documentRepository.save(document);
    }
    
    /**
     * 获取申请的所有资料
     */
    public List<ApplicationDocument> getDocumentsByFinancingId(String financingId) {
        return documentRepository.findByFinancingId(financingId);
    }
    
    /**
     * 打包下载资料（生成ZIP文件）
     */
    public String downloadAllDocuments(String financingId) {
        List<ApplicationDocument> documents = documentRepository.findByFinancingId(financingId);
        
        // TODO: 实现ZIP文件打包逻辑
        // 1. 从文件URL下载所有文件
        // 2. 打包成ZIP
        // 3. 上传到文件服务器
        // 4. 返回下载URL
        
        return "/downloads/" + financingId + ".zip";
    }
    
    /**
     * 获取资料统计
     */
    public Map<String, Object> getDocumentStatistics(String financingId) {
        List<ApplicationDocument> documents = documentRepository.findByFinancingId(financingId);
        
        Long totalSize = documentRepository.getTotalFileSize(financingId);
        int totalCount = documents.size();
        int verifiedCount = (int) documents.stream()
            .filter(d -> d.getVerifyStatus() == ApplicationDocument.VerifyStatus.APPROVED)
            .count();
        int pendingCount = (int) documents.stream()
            .filter(d -> d.getVerifyStatus() == ApplicationDocument.VerifyStatus.PENDING)
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", totalCount);
        stats.put("totalSize", totalSize);
        stats.put("verifiedCount", verifiedCount);
        stats.put("pendingCount", pendingCount);
        
        return stats;
    }
}
```

### 6.5 BankInfoService (银行信息服务)

**路径**: `com.agriverse.bank.service.BankInfoService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class BankInfoService {
    private final BankInfoRepository bankInfoRepository;
    private final BankAccountRepository accountRepository;
    
    /**
     * 创建或更新银行信息
     */
    public BankInfo saveBankInfo(BankInfoRequest request, String bankId) {
        BankInfo bankInfo = bankInfoRepository.findById(bankId)
            .orElse(BankInfo.builder()
                .id(bankId)
                .build());
        
        bankInfo.setBankCode(request.getBankCode());
        bankInfo.setBankName(request.getBankName());
        if (request.getBankType() != null) {
            bankInfo.setBankType(BankInfo.BankType.valueOf(request.getBankType()));
        }
        bankInfo.setContactPerson(request.getContactPerson());
        bankInfo.setContactPhone(request.getContactPhone());
        bankInfo.setContactEmail(request.getContactEmail());
        bankInfo.setAddress(request.getAddress());
        bankInfo.setDescription(request.getDescription());
        bankInfo.setLogoUrl(request.getLogoUrl());
        
        return bankInfoRepository.save(bankInfo);
    }
    
    /**
     * 获取银行信息
     */
    public BankInfo getBankInfo(String bankId) {
        return bankInfoRepository.findById(bankId)
            .orElseThrow(() -> new EntityNotFoundException("银行信息不存在"));
    }
    
    /**
     * 创建银行账户
     */
    public BankAccount createAccount(BankAccountRequest request) {
        BankAccount account = BankAccount.builder()
            .id(UUID.randomUUID().toString())
            .bankId(request.getBankId())
            .accountNumber(request.getAccountNumber())
            .accountName(request.getAccountName())
            .accountType(BankAccount.AccountType.valueOf(request.getAccountType()))
            .currency(request.getCurrency() != null ? request.getCurrency() : "CNY")
            .remark(request.getRemark())
            .build();
        
        return accountRepository.save(account);
    }
    
    /**
     * 获取银行账户列表
     */
    public List<BankAccount> getBankAccounts(String bankId) {
        return accountRepository.findByBankId(bankId);
    }
    
    /**
     * 更新账户余额
     */
    public BankAccount updateAccountBalance(String accountId, BigDecimal balance) {
        BankAccount account = accountRepository.findById(accountId)
            .orElseThrow(() -> new EntityNotFoundException("账户不存在"));
        
        account.setBalance(balance);
        return accountRepository.save(account);
    }
}
```

### 6.6 BankSystemConfigService (银行系统配置服务)

**路径**: `com.agriverse.bank.service.BankSystemConfigService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class BankSystemConfigService {
    private final BankSystemConfigRepository configRepository;
    
    /**
     * 获取配置值
     */
    public String getConfigValue(String configKey) {
        return configRepository.findByConfigKey(configKey)
            .map(BankSystemConfig::getConfigValue)
            .orElse(null);
    }
    
    /**
     * 获取配置值（带类型转换）
     */
    public <T> T getConfigValue(String configKey, Class<T> type) {
        BankSystemConfig config = configRepository.findByConfigKey(configKey)
            .orElse(null);
        
        if (config == null) {
            return null;
        }
        
        try {
            switch (config.getConfigType()) {
                case NUMBER:
                    return type.cast(Double.parseDouble(config.getConfigValue()));
                case BOOLEAN:
                    return type.cast(Boolean.parseBoolean(config.getConfigValue()));
                case JSON:
                    return new ObjectMapper().readValue(config.getConfigValue(), type);
                default:
                    return type.cast(config.getConfigValue());
            }
        } catch (Exception e) {
            throw new BusinessException("配置值类型转换失败: " + configKey);
        }
    }
    
    /**
     * 设置配置值
     */
    public BankSystemConfig setConfigValue(String configKey, String configValue, 
                                          String description, String category, String updatedBy) {
        BankSystemConfig config = configRepository.findByConfigKey(configKey)
            .orElse(BankSystemConfig.builder()
                .id(UUID.randomUUID().toString())
                .configKey(configKey)
                .build());
        
        config.setConfigValue(configValue);
        if (description != null) {
            config.setDescription(description);
        }
        if (category != null) {
            config.setCategory(category);
        }
        config.setUpdatedBy(updatedBy);
        
        return configRepository.save(config);
    }
    
    /**
     * 获取分类下的所有配置
     */
    public List<BankSystemConfig> getConfigsByCategory(String category) {
        return configRepository.findByCategory(category);
    }
    
    /**
     * 获取所有配置
     */
    public List<BankSystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }
}
```

---

## 7. Controller层

### 7.1 BankDashboardController (银行仪表盘控制器)

**路径**: `com.agriverse.bank.controller.BankDashboardController`

```java
@RestController
@RequestMapping("/bank/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行仪表盘", description = "银行数据统计和趋势分析接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankDashboardController {
    private final BankDashboardService dashboardService;
    
    /**
     * 获取仪表盘统计数据
     */
    @Operation(summary = "获取仪表盘统计数据", description = "获取今日放款、在贷余额、待审批、逾期等统计数据")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getStatistics(Principal principal) {
        try {
            String bankId = principal.getName();
            DashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics(bankId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取仪表盘统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.2 BankCustomerController (银行客户管理控制器)

**路径**: `com.agriverse.bank.controller.BankCustomerController`

```java
@RestController
@RequestMapping("/bank/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行客户管理", description = "客户信息、联系记录、贷款历史管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankCustomerController {
    private final BankCustomerService customerService;
    
    /**
     * 搜索客户
     */
    @Operation(summary = "搜索客户", description = "根据关键词、状态、地区等条件搜索客户")
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<BankCustomerRelation>>> searchCustomers(
            @Valid @RequestBody CustomerSearchRequest request,
            Principal principal) {
        try {
            String bankId = principal.getName();
            Page<BankCustomerRelation> customers = customerService.searchCustomers(request, bankId);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", customers));
        } catch (Exception e) {
            log.error("搜索客户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 获取客户详情
     */
    @Operation(summary = "获取客户详情", description = "获取客户详细信息，包括贷款历史、信用评分、联系记录")
    @GetMapping("/{relationId}")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> getCustomerDetail(
            @PathVariable String relationId) {
        try {
            CustomerDetailResponse detail = customerService.getCustomerDetail(relationId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", detail));
        } catch (Exception e) {
            log.error("获取客户详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 添加客户联系记录
     */
    @Operation(summary = "添加客户联系记录", description = "记录与客户的联系信息，包括电话、邮件、拜访等")
    @PostMapping("/contacts")
    public ResponseEntity<ApiResponse<CustomerContactRecord>> addContactRecord(
            @Valid @RequestBody CustomerContactRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            CustomerContactRecord record = customerService.addContactRecord(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("添加成功", record));
        } catch (Exception e) {
            log.error("添加联系记录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 更新客户信息
     */
    @Operation(summary = "更新客户信息", description = "更新客户标签和备注信息")
    @PutMapping("/{relationId}")
    public ResponseEntity<ApiResponse<BankCustomerRelation>> updateCustomer(
            @PathVariable String relationId,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String notes) {
        try {
            BankCustomerRelation relation = customerService.updateCustomer(relationId, tags, notes);
            return ResponseEntity.ok(ApiResponse.success("更新成功", relation));
        } catch (Exception e) {
            log.error("更新客户信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 同步客户数据
     */
    @Operation(summary = "同步客户数据", description = "从融资申请中同步客户的最新数据")
    @PostMapping("/sync/{customerId}")
    public ResponseEntity<ApiResponse<Object>> syncCustomerData(
            @PathVariable String customerId,
            Principal principal) {
        try {
            String bankId = principal.getName();
            customerService.syncCustomerData(bankId, customerId);
            return ResponseEntity.ok(ApiResponse.success("同步成功", null));
        } catch (Exception e) {
            log.error("同步客户数据异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "同步失败，请稍后重试"));
        }
    }
}
```

### 7.3 BankRiskController (银行风控控制器)

**路径**: `com.agriverse.bank.controller.BankRiskController`

```java
@RestController
@RequestMapping("/bank/risk")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行风控管理", description = "风险指标监控、风险预警、风险分析接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankRiskController {
    private final RiskManagementService riskService;
    
    /**
     * 获取风控仪表盘数据
     */
    @Operation(summary = "获取风控仪表盘数据", description = "获取逾期率、不良率、授信余额等风险指标")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<RiskDashboardResponse>> getRiskDashboard() {
        try {
            RiskDashboardResponse dashboard = riskService.getRiskDashboard();
            return ResponseEntity.ok(ApiResponse.success("获取成功", dashboard));
        } catch (Exception e) {
            log.error("获取风控仪表盘异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取风险预警列表
     */
    @Operation(summary = "获取风险预警列表", description = "获取所有风险预警信息")
    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<RiskAlert>>> getRiskAlerts() {
        try {
            List<RiskAlert> alerts = riskService.getRiskAlerts();
            return ResponseEntity.ok(ApiResponse.success("获取成功", alerts));
        } catch (Exception e) {
            log.error("获取风险预警异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 手动计算风险指标
     */
    @Operation(summary = "手动计算风险指标", description = "手动触发风险指标计算")
    @PostMapping("/indicators/calculate")
    public ResponseEntity<ApiResponse<RiskIndicator>> calculateRiskIndicator() {
        try {
            RiskIndicator indicator = riskService.calculateCurrentRiskIndicator();
            return ResponseEntity.ok(ApiResponse.success("计算成功", indicator));
        } catch (Exception e) {
            log.error("计算风险指标异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "计算失败，请稍后重试"));
        }
    }
}
```

### 7.4 BankDocumentController (申请资料管理控制器)

**路径**: `com.agriverse.bank.controller.BankDocumentController`

```java
@RestController
@RequestMapping("/bank/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "申请资料管理", description = "申请资料上传、审核、下载管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankDocumentController {
    private final ApplicationDocumentService documentService;
    
    /**
     * 上传申请资料
     */
    @Operation(summary = "上传申请资料", description = "上传融资申请的相关资料文件")
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ApplicationDocument>> uploadDocument(
            @Valid @RequestBody DocumentUploadRequest request,
            Principal principal) {
        try {
            String uploadedBy = principal.getName();
            ApplicationDocument document = documentService.uploadDocument(request, uploadedBy);
            return ResponseEntity.ok(ApiResponse.success("上传成功", document));
        } catch (Exception e) {
            log.error("上传资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "上传失败，请稍后重试"));
        }
    }
    
    /**
     * 审核资料
     */
    @Operation(summary = "审核资料", description = "审核申请资料，批准或拒绝")
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<ApplicationDocument>> verifyDocument(
            @Valid @RequestBody DocumentVerifyRequest request,
            Principal principal) {
        try {
            String verifiedBy = principal.getName();
            ApplicationDocument document = documentService.verifyDocument(request, verifiedBy);
            return ResponseEntity.ok(ApiResponse.success("审核成功", document));
        } catch (Exception e) {
            log.error("审核资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 获取申请的所有资料
     */
    @Operation(summary = "获取申请资料列表", description = "获取指定融资申请的所有资料")
    @GetMapping("/financing/{financingId}")
    public ResponseEntity<ApiResponse<List<ApplicationDocument>>> getDocuments(
            @PathVariable String financingId) {
        try {
            List<ApplicationDocument> documents = documentService.getDocumentsByFinancingId(financingId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", documents));
        } catch (Exception e) {
            log.error("获取资料列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 打包下载所有资料
     */
    @Operation(summary = "打包下载资料", description = "将申请的所有资料打包成ZIP文件下载")
    @GetMapping("/download-all/{financingId}")
    public ResponseEntity<ApiResponse<String>> downloadAllDocuments(
            @PathVariable String financingId) {
        try {
            String downloadUrl = documentService.downloadAllDocuments(financingId);
            return ResponseEntity.ok(ApiResponse.success("打包成功", downloadUrl));
        } catch (Exception e) {
            log.error("打包下载异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "打包失败，请稍后重试"));
        }
    }
    
    /**
     * 获取资料统计
     */
    @Operation(summary = "获取资料统计", description = "获取申请资料的统计信息")
    @GetMapping("/statistics/{financingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDocumentStatistics(
            @PathVariable String financingId) {
        try {
            Map<String, Object> statistics = documentService.getDocumentStatistics(financingId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取资料统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}
```

### 7.5 BankInfoController (银行信息管理控制器)

**路径**: `com.agriverse.bank.controller.BankInfoController`

```java
@RestController
@RequestMapping("/bank/info")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行信息管理", description = "银行基本信息、账户管理、系统配置接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankInfoController {
    private final BankInfoService bankInfoService;
    private final BankSystemConfigService configService;
    
    /**
     * 获取银行信息
     */
    @Operation(summary = "获取银行信息", description = "获取当前银行的基本信息")
    @GetMapping
    public ResponseEntity<ApiResponse<BankInfo>> getBankInfo(Principal principal) {
        try {
            String bankId = principal.getName();
            BankInfo bankInfo = bankInfoService.getBankInfo(bankId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", bankInfo));
        } catch (Exception e) {
            log.error("获取银行信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新银行信息
     */
    @Operation(summary = "更新银行信息", description = "更新银行的基本信息")
    @PutMapping
    public ResponseEntity<ApiResponse<BankInfo>> updateBankInfo(
            @Valid @RequestBody BankInfoRequest request,
            Principal principal) {
        try {
            String bankId = principal.getName();
            BankInfo bankInfo = bankInfoService.saveBankInfo(request, bankId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", bankInfo));
        } catch (Exception e) {
            log.error("更新银行信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取银行账户列表
     */
    @Operation(summary = "获取银行账户列表", description = "获取银行的所有账户")
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<BankAccount>>> getBankAccounts(Principal principal) {
        try {
            String bankId = principal.getName();
            List<BankAccount> accounts = bankInfoService.getBankAccounts(bankId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", accounts));
        } catch (Exception e) {
            log.error("获取账户列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 创建银行账户
     */
    @Operation(summary = "创建银行账户", description = "创建新的银行账户")
    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<BankAccount>> createAccount(
            @Valid @RequestBody BankAccountRequest request) {
        try {
            BankAccount account = bankInfoService.createAccount(request);
            return ResponseEntity.ok(ApiResponse.success("创建成功", account));
        } catch (Exception e) {
            log.error("创建账户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 获取系统配置
     */
    @Operation(summary = "获取系统配置", description = "根据分类获取系统配置")
    @GetMapping("/configs")
    public ResponseEntity<ApiResponse<List<BankSystemConfig>>> getConfigs(
            @RequestParam(required = false) String category) {
        try {
            List<BankSystemConfig> configs = category != null ?
                configService.getConfigsByCategory(category) :
                configService.getAllConfigs();
            return ResponseEntity.ok(ApiResponse.success("获取成功", configs));
        } catch (Exception e) {
            log.error("获取配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 设置系统配置
     */
    @Operation(summary = "设置系统配置", description = "设置或更新系统配置值")
    @PostMapping("/configs")
    public ResponseEntity<ApiResponse<BankSystemConfig>> setConfig(
            @RequestParam String configKey,
            @RequestParam String configValue,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            BankSystemConfig config = configService.setConfigValue(
                configKey, configValue, description, category, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("设置成功", config));
        } catch (Exception e) {
            log.error("设置配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "设置失败，请稍后重试"));
        }
    }
}
```

---

## 8. 业务流程说明

### 8.1 银行仪表盘数据统计流程

```
1. 数据采集
   ├─ 从放款记录表统计今日放款
   ├─ 从融资申请表统计在贷余额
   ├─ 从融资申请表统计待审批数量
   └─ 从还款计划表统计逾期数量
   │
2. 趋势计算
   ├─ 计算近6个月的放款趋势
   ├─ 计算近6个月的在贷余额趋势
   └─ 生成趋势图表数据
   │
3. 数据返回
   └─ 返回统计结果给前端展示
```

### 8.2 客户管理流程

```
1. 客户搜索
   ├─ 输入搜索关键词（姓名、电话）
   ├─ 选择筛选条件（状态、地区、贷款次数）
   ├─ 执行搜索查询
   └─ 返回分页结果
   │
2. 客户详情查看
   ├─ 查看客户基本信息
   ├─ 查看贷款历史记录
   ├─ 查看信用评分历史
   └─ 查看联系记录
   │
3. 客户关系维护
   ├─ 添加联系记录
   ├─ 更新客户标签
   ├─ 添加备注信息
   └─ 设置跟进提醒
   │
4. 客户数据同步
   ├─ 从融资申请中同步贷款数据
   ├─ 更新累计贷款次数和金额
   ├─ 更新当前在途贷款信息
   └─ 更新客户状态
```

### 8.3 风控管理流程

```
1. 风险指标计算
   ├─ 计算逾期率（逾期金额/总金额）
   ├─ 计算不良率（不良金额/总金额）
   ├─ 计算授信余额
   └─ 计算联合贷占比
   │
2. 风险趋势分析
   ├─ 获取近6个月的风险指标
   ├─ 生成趋势图表数据
   └─ 分析风险变化趋势
   │
3. 风险预警
   ├─ 检测高风险客户（信用评分<60）
   ├─ 检测逾期客户
   ├─ 检测信用评分下降
   └─ 生成预警列表
   │
4. 定时任务
   ├─ 每天凌晨1点自动计算风险指标
   ├─ 保存到风险指标记录表
   └─ 更新风控仪表盘数据
```

### 8.4 申请资料管理流程

```
1. 资料上传
   ├─ 农户上传申请资料
   ├─ 记录文件信息（类型、大小、URL）
   ├─ 设置审核状态为待审核
   └─ 保存到申请资料表
   │
2. 资料审核
   ├─ 银行查看资料列表
   ├─ 审核每个资料文件
   ├─ 填写审核意见
   └─ 批准或拒绝
   │
3. 资料下载
   ├─ 查看资料列表
   ├─ 单个文件下载
   ├─ 批量文件下载
   └─ 打包下载（ZIP格式）
```

### 8.5 银行信息管理流程

```
1. 银行信息维护
   ├─ 查看银行基本信息
   ├─ 更新银行信息
   └─ 上传银行Logo
   │
2. 账户管理
   ├─ 查看账户列表
   ├─ 创建新账户
   ├─ 更新账户余额
   └─ 账户状态管理
   │
3. 系统配置
   ├─ 查看系统配置
   ├─ 按分类筛选配置
   ├─ 更新配置值
   └─ 配置权限控制
```

---

## 9. API接口设计

### 9.1 银行仪表盘接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/bank/dashboard/statistics` | 获取仪表盘统计数据 | BANK |

### 9.2 客户管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/bank/customers/search` | 搜索客户 | BANK |
| GET | `/api/bank/customers/{relationId}` | 获取客户详情 | BANK |
| POST | `/api/bank/customers/contacts` | 添加客户联系记录 | BANK |
| PUT | `/api/bank/customers/{relationId}` | 更新客户信息 | BANK |
| POST | `/api/bank/customers/sync/{customerId}` | 同步客户数据 | BANK |

### 9.3 风控管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/bank/risk/dashboard` | 获取风控仪表盘数据 | BANK |
| GET | `/api/bank/risk/alerts` | 获取风险预警列表 | BANK |
| POST | `/api/bank/risk/indicators/calculate` | 手动计算风险指标 | BANK |

### 9.4 申请资料管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/bank/documents/upload` | 上传申请资料 | BANK |
| POST | `/api/bank/documents/verify` | 审核资料 | BANK |
| GET | `/api/bank/documents/financing/{financingId}` | 获取申请资料列表 | BANK |
| GET | `/api/bank/documents/download-all/{financingId}` | 打包下载资料 | BANK |
| GET | `/api/bank/documents/statistics/{financingId}` | 获取资料统计 | BANK |

### 9.5 银行信息管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/bank/info` | 获取银行信息 | BANK |
| PUT | `/api/bank/info` | 更新银行信息 | BANK |
| GET | `/api/bank/info/accounts` | 获取银行账户列表 | BANK |
| POST | `/api/bank/info/accounts` | 创建银行账户 | BANK |
| GET | `/api/bank/info/configs` | 获取系统配置 | BANK |
| POST | `/api/bank/info/configs` | 设置系统配置 | BANK |

### 9.6 响应格式

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
   - 执行 SQL 脚本创建所有表（客户关系表、联系记录表、申请资料表、银行信息表、账户表、风险指标表、系统配置表）
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

### 10.2 第二阶段：Service 层

1. **实现 BankDashboardService**
   - 仪表盘统计数据计算
   - 趋势数据生成
   - 数据聚合逻辑

2. **实现 BankCustomerService**
   - 客户搜索功能
   - 客户详情查询
   - 联系记录管理
   - 客户数据同步

3. **实现 RiskManagementService**
   - 风险指标计算
   - 风险趋势分析
   - 风险预警生成
   - 定时任务实现

4. **实现 ApplicationDocumentService**
   - 资料上传处理
   - 资料审核功能
   - 资料下载功能
   - ZIP打包功能

5. **实现 BankInfoService**
   - 银行信息管理
   - 账户管理
   - 余额更新

6. **实现 BankSystemConfigService**
   - 配置读取
   - 配置更新
   - 类型转换

### 10.3 第三阶段：Controller 层

1. **实现 BankDashboardController**
   - 仪表盘统计接口
   - 参数验证
   - 异常处理

2. **实现 BankCustomerController**
   - 客户搜索接口
   - 客户详情接口
   - 联系记录接口
   - 客户更新接口

3. **实现 BankRiskController**
   - 风控仪表盘接口
   - 风险预警接口
   - 风险指标计算接口

4. **实现 BankDocumentController**
   - 资料上传接口
   - 资料审核接口
   - 资料下载接口

5. **实现 BankInfoController**
   - 银行信息接口
   - 账户管理接口
   - 系统配置接口

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
   - 定时任务配置

---

## 11. 注意事项

### 11.1 数据一致性

- 使用 `@Transactional` 保证事务一致性
- 客户数据同步时要保证数据准确性
- 风险指标计算要确保数据实时性
- 文件上传要处理并发情况

### 11.2 安全性

- 所有接口需要 JWT 认证
- 权限控制使用 `@PreAuthorize`
- 敏感数据加密存储
- 文件下载要验证权限
- 系统配置修改要记录操作日志

### 11.3 性能考虑

- 大数据量查询使用分页
- 复杂计算考虑缓存（Redis）
- 风险指标计算使用定时任务，避免实时计算
- 文件打包下载使用异步处理
- 客户搜索使用索引优化

### 11.4 异常处理

- 统一异常处理机制
- 友好的错误提示
- 记录异常日志
- 文件操作异常处理

### 11.5 业务规则

- 客户状态流转验证
- 风险指标计算规则
- 文件类型和大小限制
- 系统配置权限控制

### 11.6 定时任务

- 风险指标计算：每天凌晨1点执行
- 客户数据同步：可设置定时同步
- 文件清理：定期清理临时文件

---

## 12. 扩展功能（后续实现）

1. **客户画像分析**
   - 客户行为分析
   - 客户价值评估
   - 客户推荐系统

2. **智能风控**
   - 机器学习风险模型
   - 实时风险监控
   - 自动风险预警

3. **文件管理增强**
   - 文件OCR识别
   - 文件自动分类
   - 文件版本管理

4. **报表统计**
   - 客户统计报表
   - 风险分析报表
   - 业务数据报表

5. **消息通知**
   - 风险预警通知
   - 客户跟进提醒
   - 系统配置变更通知

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。