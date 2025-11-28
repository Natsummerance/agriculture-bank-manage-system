# 贷款功能后端实现流程文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 贷款管理（银行 + 农户）

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

### 1.1 农户模块功能

1. **融资申请**
   - 提交融资申请（金额、期限、用途）
   - 查看融资详情
   - 查看融资进度
   - 智能拼单匹配（金额低于最低额度时）

2. **合同管理**
   - 电子合同签署
   - 合同查看

3. **还款管理**
   - 还款计划查看
   - 在线还款
   - 提前还款试算
   - 还款记录查询

### 1.2 银行模块功能

1. **产品管理**
   - 创建/编辑/删除贷款产品
   - 产品列表查询

2. **审批管理**
   - 审批列表查询
   - 审批详情查看
   - 批准/拒绝申请
   - 信用评分卡计算

3. **合同管理**
   - 合同生成
   - 合同预览
   - 合同下载

4. **放款管理**
   - 放款列表
   - 放款操作
   - 放款记录

5. **贷后管理**
   - 贷后监控
   - 逾期管理
   - 对账中心
   - 逾期预警

---

## 2. 数据库设计

### 2.1 贷款产品表 (loan_products)

```sql
CREATE TABLE IF NOT EXISTS loan_products (
    id VARCHAR(36) PRIMARY KEY COMMENT '产品ID',
    name VARCHAR(200) NOT NULL COMMENT '产品名称',
    rate DECIMAL(5,2) NOT NULL COMMENT '年利率（%）',
    min_amount DECIMAL(15,2) NOT NULL COMMENT '最小金额（元）',
    max_amount DECIMAL(15,2) NOT NULL COMMENT '最大金额（元）',
    term_months INT NOT NULL COMMENT '期限（月）',
    description TEXT COMMENT '产品描述',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, INACTIVE-停用',
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='贷款产品表';
```

### 2.2 融资申请表 (financing_applications)

```sql
CREATE TABLE IF NOT EXISTS financing_applications (
    id VARCHAR(36) PRIMARY KEY COMMENT '申请ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    product_id VARCHAR(36) COMMENT '产品ID（可选）',
    amount DECIMAL(15,2) NOT NULL COMMENT '申请金额（元）',
    term_months INT NOT NULL COMMENT '期限（月）',
    purpose VARCHAR(500) NOT NULL COMMENT '资金用途',
    status VARCHAR(20) NOT NULL DEFAULT 'APPLIED' COMMENT '状态: APPLIED-已申请, REVIEWING-审批中, APPROVED-已通过, REJECTED-已拒绝, SIGNED-已签约, DISBURSED-已放款, REPAYING-还款中, SETTLED-已结清',
    interest_rate DECIMAL(5,2) COMMENT '实际利率（%）',
    credit_score INT COMMENT '信用评分',
    reviewer_id VARCHAR(36) COMMENT '审批人ID',
    reviewed_at DATETIME COMMENT '审批时间',
    review_comment TEXT COMMENT '审批意见',
    contract_id VARCHAR(36) COMMENT '合同ID',
    signed_at DATETIME COMMENT '签约时间',
    disbursed_at DATETIME COMMENT '放款时间',
    disbursed_amount DECIMAL(15,2) COMMENT '实际放款金额',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (farmer_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES loan_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='融资申请表';
```

### 2.3 融资时间线表 (financing_timeline)

```sql
CREATE TABLE IF NOT EXISTS financing_timeline (
    id VARCHAR(36) PRIMARY KEY COMMENT '时间线ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    actor VARCHAR(20) NOT NULL COMMENT '操作人类型: FARMER-农户, BANK-银行, ADMIN-管理员',
    actor_id VARCHAR(36) COMMENT '操作人ID',
    action VARCHAR(100) NOT NULL COMMENT '操作动作',
    note TEXT COMMENT '备注说明',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='融资时间线表';
```

### 2.4 还款计划表 (repayment_schedules)

```sql
CREATE TABLE IF NOT EXISTS repayment_schedules (
    id VARCHAR(36) PRIMARY KEY COMMENT '还款计划ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    installment_number INT NOT NULL COMMENT '期数',
    due_date DATE NOT NULL COMMENT '到期日期',
    principal DECIMAL(15,2) NOT NULL COMMENT '本金（元）',
    interest DECIMAL(15,2) NOT NULL COMMENT '利息（元）',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '总金额（元）',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待还款, PAID-已还款, OVERDUE-已逾期',
    paid_at DATETIME COMMENT '还款时间',
    paid_amount DECIMAL(15,2) COMMENT '实际还款金额',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='还款计划表';
```

### 2.5 还款记录表 (repayment_records)

```sql
CREATE TABLE IF NOT EXISTS repayment_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '还款记录ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    schedule_id VARCHAR(36) COMMENT '还款计划ID（正常还款）',
    repayment_type VARCHAR(20) NOT NULL COMMENT '还款类型: NORMAL-正常还款, EARLY-提前还款, OVERDUE-逾期还款',
    amount DECIMAL(15,2) NOT NULL COMMENT '还款金额（元）',
    principal DECIMAL(15,2) NOT NULL COMMENT '本金（元）',
    interest DECIMAL(15,2) NOT NULL COMMENT '利息（元）',
    penalty DECIMAL(15,2) DEFAULT 0 COMMENT '罚息（元）',
    payment_method VARCHAR(50) COMMENT '支付方式',
    transaction_id VARCHAR(100) COMMENT '交易流水号',
    paid_at DATETIME NOT NULL COMMENT '还款时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_paid_at (paid_at),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id),
    FOREIGN KEY (schedule_id) REFERENCES repayment_schedules(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='还款记录表';
```

### 2.6 电子合同表 (contracts)

```sql
CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(36) PRIMARY KEY COMMENT '合同ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    contract_no VARCHAR(50) NOT NULL UNIQUE COMMENT '合同编号',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    farmer_name VARCHAR(100) NOT NULL COMMENT '农户姓名',
    farmer_id_card VARCHAR(18) COMMENT '农户身份证号',
    bank_name VARCHAR(200) NOT NULL COMMENT '银行名称',
    amount DECIMAL(15,2) NOT NULL COMMENT '贷款金额（元）',
    interest_rate DECIMAL(5,2) NOT NULL COMMENT '利率（%）',
    term_months INT NOT NULL COMMENT '期限（月）',
    purpose VARCHAR(500) COMMENT '资金用途',
    start_date DATE COMMENT '合同开始日期',
    end_date DATE COMMENT '合同结束日期',
    repayment_method VARCHAR(50) COMMENT '还款方式',
    contract_content TEXT COMMENT '合同内容（JSON格式）',
    contract_file_url VARCHAR(500) COMMENT '合同文件URL',
    farmer_signature_url VARCHAR(500) COMMENT '农户签名图片URL',
    bank_signature_url VARCHAR(500) COMMENT '银行签名图片URL',
    farmer_signed_at DATETIME COMMENT '农户签署时间',
    bank_signed_at DATETIME COMMENT '银行签署时间',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态: DRAFT-草稿, SIGNED-已签署, CANCELLED-已取消',
    blockchain_hash VARCHAR(64) COMMENT '区块链哈希值',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_contract_no (contract_no),
    INDEX idx_status (status),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='电子合同表';
```

### 2.7 智能拼单表 (joint_loan_groups)

```sql
CREATE TABLE IF NOT EXISTS joint_loan_groups (
    id VARCHAR(36) PRIMARY KEY COMMENT '拼单组ID',
    group_name VARCHAR(200) COMMENT '拼单组名称',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '总金额（元）',
    min_amount DECIMAL(15,2) NOT NULL COMMENT '最低拼单金额（元）',
    status VARCHAR(20) NOT NULL DEFAULT 'MATCHING' COMMENT '状态: MATCHING-匹配中, MATCHED-已匹配, APPLIED-已申请, CANCELLED-已取消',
    matched_count INT DEFAULT 0 COMMENT '已匹配农户数',
    target_count INT DEFAULT 0 COMMENT '目标农户数',
    created_by VARCHAR(36) NOT NULL COMMENT '创建人ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='智能拼单组表';
```

### 2.8 拼单成员表 (joint_loan_members)

```sql
CREATE TABLE IF NOT EXISTS joint_loan_members (
    id VARCHAR(36) PRIMARY KEY COMMENT '成员ID',
    group_id VARCHAR(36) NOT NULL COMMENT '拼单组ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    amount DECIMAL(15,2) NOT NULL COMMENT '申请金额（元）',
    purpose VARCHAR(500) COMMENT '资金用途',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待确认, CONFIRMED-已确认, CANCELLED-已取消',
    financing_id VARCHAR(36) COMMENT '生成的融资申请ID',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_group_id (group_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    FOREIGN KEY (group_id) REFERENCES joint_loan_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼单成员表';
```

### 2.9 信用评分记录表 (credit_scores)

```sql
CREATE TABLE IF NOT EXISTS credit_scores (
    id VARCHAR(36) PRIMARY KEY COMMENT '评分ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    credit_history_score INT COMMENT '信用历史评分（0-100）',
    income_score INT COMMENT '收入评分（0-100）',
    asset_score INT COMMENT '资产评分（0-100）',
    debt_ratio_score INT COMMENT '负债率评分（0-100）',
    experience_score INT COMMENT '行业经验评分（0-100）',
    total_score INT NOT NULL COMMENT '综合评分（0-100）',
    risk_level VARCHAR(20) NOT NULL COMMENT '风险等级: LOW-低风险, MEDIUM-中风险, HIGH-高风险',
    suggested_amount DECIMAL(15,2) COMMENT '建议额度（元）',
    reviewer_id VARCHAR(36) COMMENT '评分人ID',
    reviewed_at DATETIME COMMENT '评分时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_total_score (total_score),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='信用评分记录表';
```

### 2.10 放款记录表 (disbursements)

```sql
CREATE TABLE IF NOT EXISTS disbursements (
    id VARCHAR(36) PRIMARY KEY COMMENT '放款ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    contract_id VARCHAR(36) COMMENT '合同ID',
    amount DECIMAL(15,2) NOT NULL COMMENT '放款金额（元）',
    bank_account VARCHAR(50) COMMENT '银行账户',
    farmer_account VARCHAR(50) COMMENT '农户账户',
    transaction_id VARCHAR(100) COMMENT '交易流水号',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待放款, SUCCESS-放款成功, FAILED-放款失败',
    disbursed_by VARCHAR(36) COMMENT '放款操作人ID',
    disbursed_at DATETIME COMMENT '放款时间',
    remark TEXT COMMENT '备注',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_status (status),
    INDEX idx_disbursed_at (disbursed_at),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id),
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='放款记录表';
```

---

## 3. 实体类设计

### 3.1 LoanProduct (贷款产品)

**路径**: `com.agriverse.bank.entity.LoanProduct`

```java
@Entity
@Table(name = "loan_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanProduct {
    @Id
    private String id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal rate;
    
    @Column(name = "min_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal minAmount;
    
    @Column(name = "max_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal maxAmount;
    
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
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
    
    public enum ProductStatus {
        ACTIVE, INACTIVE
    }
}
```

### 3.2 FinancingApplication (融资申请)

**路径**: `com.agriverse.finance.entity.FinancingApplication`

```java
@Entity
@Table(name = "financing_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplication {
    @Id
    private String id;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "product_id", length = 36)
    private String productId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;
    
    @Column(nullable = false, length = 500)
    private String purpose;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private FinancingStatus status;
    
    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;
    
        @Column(name = "credit_score")
    private Integer creditScore;
    
    @Column(name = "reviewer_id", length = 36)
    private String reviewerId;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "review_comment", columnDefinition = "TEXT")
    private String reviewComment;
    
    @Column(name = "contract_id", length = 36)
    private String contractId;
    
    @Column(name = "signed_at")
    private LocalDateTime signedAt;
    
    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;
    
    @Column(name = "disbursed_amount", precision = 15, scale = 2)
    private BigDecimal disbursedAmount;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = FinancingStatus.APPLIED;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum FinancingStatus {
        APPLIED,      // 已申请
        REVIEWING,    // 审批中
        APPROVED,     // 已通过
        REJECTED,     // 已拒绝
        SIGNED,       // 已签约
        DISBURSED,    // 已放款
        REPAYING,     // 还款中
        SETTLED       // 已结清
    }
}
```

### 3.3 FinancingTimeline (融资时间线)

**路径**: `com.agriverse.finance.entity.FinancingTimeline`

```java
@Entity
@Table(name = "financing_timeline")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingTimeline {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ActorType actor;
    
    @Column(name = "actor_id", length = 36)
    private String actorId;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum ActorType {
        FARMER, BANK, ADMIN
    }
}
```

### 3.4 RepaymentSchedule (还款计划)

**路径**: `com.agriverse.finance.entity.RepaymentSchedule`

```java
@Entity
@Table(name = "repayment_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentSchedule {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "installment_number", nullable = false)
    private Integer installmentNumber;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal interest;
    
        @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ScheduleStatus status;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "paid_amount", precision = 15, scale = 2)
    private BigDecimal paidAmount;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ScheduleStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ScheduleStatus {
        PENDING, PAID, OVERDUE
    }
}
```

### 3.5 RepaymentRecord (还款记录)

**路径**: `com.agriverse.finance.entity.RepaymentRecord`

```java
@Entity
@Table(name = "repayment_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentRecord {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "schedule_id", length = 36)
    private String scheduleId;
    
    @Column(name = "repayment_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RepaymentType repaymentType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal interest;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal penalty;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (penalty == null) {
            penalty = BigDecimal.ZERO;
        }
    }
    
    public enum RepaymentType {
        NORMAL, EARLY, OVERDUE
    }
}
```

### 3.6 Contract (电子合同)

**路径**: `com.agriverse.finance.entity.Contract`

```java
@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "contract_no", nullable = false, unique = true, length = 50)
    private String contractNo;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", nullable = false, length = 100)
    private String farmerName;
    
    @Column(name = "farmer_id_card", length = 18)
    private String farmerIdCard;
    
    @Column(name = "bank_name", nullable = false, length = 200)
    private String bankName;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;
    
    @Column(length = 500)
    private String purpose;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "repayment_method", length = 50)
    private String repaymentMethod;
    
    @Column(name = "contract_content", columnDefinition = "TEXT")
    private String contractContent;
    
    @Column(name = "contract_file_url", length = 500)
    private String contractFileUrl;
    
    @Column(name = "farmer_signature_url", length = 500)
    private String farmerSignatureUrl;
    
    @Column(name = "bank_signature_url", length = 500)
    private String bankSignatureUrl;
    
    @Column(name = "farmer_signed_at")
    private LocalDateTime farmerSignedAt;
    
    @Column(name = "bank_signed_at")
    private LocalDateTime bankSignedAt;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ContractStatus status;
    
    @Column(name = "blockchain_hash", length = 64)
    private String blockchainHash;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ContractStatus.DRAFT;
        }
        if (contractNo == null) {
            contractNo = generateContractNo();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    private String generateContractNo() {
        return "CT" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) 
               + String.format("%06d", (int)(Math.random() * 1000000));
    }
    
    public enum ContractStatus {
        DRAFT, SIGNED, CANCELLED
    }
}
```

### 3.7 JointLoanGroup (智能拼单组)

**路径**: `com.agriverse.finance.entity.JointLoanGroup`

```java
@Entity
@Table(name = "joint_loan_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JointLoanGroup {
    @Id
    private String id;
    
    @Column(name = "group_name", length = 200)
    private String groupName;
    
    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "min_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal minAmount;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private GroupStatus status;
    
    @Column(name = "matched_count")
    private Integer matchedCount;
    
    @Column(name = "target_count")
    private Integer targetCount;
    
    @Column(name = "created_by", nullable = false, length = 36)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = GroupStatus.MATCHING;
        }
        if (matchedCount == null) {
            matchedCount = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum GroupStatus {
        MATCHING, MATCHED, APPLIED, CANCELLED
    }
}
```

### 3.8 JointLoanMember (拼单成员)

**路径**: `com.agriverse.finance.entity.JointLoanMember`

```java
@Entity
@Table(name = "joint_loan_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JointLoanMember {
    @Id
    private String id;
    
    @Column(name = "group_id", nullable = false, length = 36)
    private String groupId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 500)
    private String purpose;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private MemberStatus status;
    
    @Column(name = "financing_id", length = 36)
    private String financingId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = MemberStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum MemberStatus {
        PENDING, CONFIRMED, CANCELLED
    }
}
```

### 3.9 CreditScore (信用评分)

**路径**: `com.agriverse.bank.entity.CreditScore`

```java
@Entity
@Table(name = "credit_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditScore {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "credit_history_score")
    private Integer creditHistoryScore;
    
    @Column(name = "income_score")
    private Integer incomeScore;
    
    @Column(name = "asset_score")
    private Integer assetScore;
    
    @Column(name = "debt_ratio_score")
    private Integer debtRatioScore;
    
    @Column(name = "experience_score")
    private Integer experienceScore;
    
    @Column(name = "total_score", nullable = false)
    private Integer totalScore;
    
    @Column(name = "risk_level", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    @Column(name = "suggested_amount", precision = 15, scale = 2)
    private BigDecimal suggestedAmount;
    
    @Column(name = "reviewer_id", length = 36)
    private String reviewerId;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum RiskLevel {
        LOW, MEDIUM, HIGH
    }
}
```

### 3.10 Disbursement (放款记录)

**路径**: `com.agriverse.bank.entity.Disbursement`

```java
@Entity
@Table(name = "disbursements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disbursement {
    @Id
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "contract_id", length = 36)
    private String contractId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "bank_account", length = 50)
    private String bankAccount;
    
    @Column(name = "farmer_account", length = 50)
    private String farmerAccount;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DisbursementStatus status;
    
    @Column(name = "disbursed_by", length = 36)
    private String disbursedBy;
    
    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;
    
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
        if (status == null) {
            status = DisbursementStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum DisbursementStatus {
        PENDING, SUCCESS, FAILED
    }
}
```

---

## 4. DTO设计

### 4.1 农户模块DTO

#### 4.1.1 FinancingApplicationRequest (融资申请请求)

**路径**: `com.agriverse.finance.dto.FinancingApplicationRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplicationRequest {
    @NotNull(message = "申请金额不能为空")
    @DecimalMin(value = "0.01", message = "申请金额必须大于0")
    private BigDecimal amount;
    
    @NotNull(message = "期限不能为空")
    @Min(value = 1, message = "期限至少1个月")
    @Max(value = 120, message = "期限不能超过120个月")
    private Integer termMonths;
    
    @NotBlank(message = "资金用途不能为空")
    @Size(max = 500, message = "资金用途不能超过500字符")
    private String purpose;
    
    private String productId; // 可选，如果选择特定产品
}
```

#### 4.1.2 FinancingApplicationResponse (融资申请响应)

**路径**: `com.agriverse.finance.dto.FinancingApplicationResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplicationResponse {
    private String id;
    private String farmerId;
    private String productId;
    private BigDecimal amount;
    private Integer termMonths;
    private String purpose;
    private String status;
    private BigDecimal interestRate;
    private Integer creditScore;
    private String contractId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TimelineItemResponse> timeline;
    private List<RepaymentScheduleResponse> repaymentSchedule;
}
```

#### 4.1.3 RepaymentRequest (还款请求)

**路径**: `com.agriverse.finance.dto.RepaymentRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    private String scheduleId; // 正常还款时指定计划ID
    
    @NotNull(message = "还款金额不能为空")
    @DecimalMin(value = "0.01", message = "还款金额必须大于0")
    private BigDecimal amount;
    
    @NotBlank(message = "支付方式不能为空")
    private String paymentMethod;
    
    private String transactionId; // 交易流水号
}
```

#### 4.1.4 EarlyRepaymentCalculateRequest (提前还款试算请求)

**路径**: `com.agriverse.finance.dto.EarlyRepaymentCalculateRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarlyRepaymentCalculateRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotNull(message = "提前还款金额不能为空")
    @DecimalMin(value = "0.01", message = "还款金额必须大于0")
    private BigDecimal amount;
    
    @NotNull(message = "提前还款日期不能为空")
    private LocalDate repaymentDate;
}
```

### 4.2 银行模块DTO

#### 4.2.1 LoanProductRequest (贷款产品请求)

**路径**: `com.agriverse.bank.dto.LoanProductRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanProductRequest {
    @NotBlank(message = "产品名称不能为空")
    @Size(max = 200, message = "产品名称不能超过200字符")
    private String name;
    
    @NotNull(message = "年利率不能为空")
    @DecimalMin(value = "0.01", message = "年利率必须大于0")
    @DecimalMax(value = "100", message = "年利率不能超过100%")
    private BigDecimal rate;
    
    @NotNull(message = "最小金额不能为空")
    @DecimalMin(value = "0.01", message = "最小金额必须大于0")
    private BigDecimal minAmount;
    
    @NotNull(message = "最大金额不能为空")
    @DecimalMin(value = "0.01", message = "最大金额必须大于0")
    private BigDecimal maxAmount;
    
    @NotNull(message = "期限不能为空")
    @Min(value = 1, message = "期限至少1个月")
    @Max(value = 120, message = "期限不能超过120个月")
    private Integer termMonths;
    
    private String description;
}
```

#### 4.2.2 ApprovalRequest (审批请求)

**路径**: `com.agriverse.bank.dto.ApprovalRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "审批结果不能为空")
    private String action; // APPROVE 或 REJECT
    
    private String reviewComment; // 审批意见
    
    private Integer creditScore; // 信用评分（批准时）
    
    private BigDecimal interestRate; // 实际利率（批准时）
}
```

#### 4.2.3 CreditScoreRequest (信用评分请求)

**路径**: `com.agriverse.bank.dto.CreditScoreRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditScoreRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @Min(value = 0, message = "信用历史评分不能小于0")
    @Max(value = 100, message = "信用历史评分不能超过100")
    private Integer creditHistoryScore;
    
    @NotNull(message = "年收入不能为空")
    @DecimalMin(value = "0", message = "年收入不能小于0")
    private BigDecimal income;
    
    @NotNull(message = "资产总额不能为空")
    @DecimalMin(value = "0", message = "资产总额不能小于0")
    private BigDecimal assets;
    
    @Min(value = 0, message = "负债率不能小于0")
    @Max(value = 100, message = "负债率不能超过100")
    private Integer debtRatio;
    
    @Min(value = 0, message = "行业经验评分不能小于0")
    @Max(value = 100, message = "行业经验评分不能超过100")
    private Integer industryExperience;
}
```

#### 4.2.4 ContractGenerateRequest (合同生成请求)

**路径**: `com.agriverse.bank.dto.ContractGenerateRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractGenerateRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    private String bankName; // 银行名称
    private String bankAccount; // 银行账户
}
```

#### 4.2.5 DisbursementRequest (放款请求)

**路径**: `com.agriverse.bank.dto.DisbursementRequest`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementRequest {
    @NotBlank(message = "融资申请ID不能为空")
    private String financingId;
    
    @NotBlank(message = "合同ID不能为空")
    private String contractId;
    
    @NotNull(message = "放款金额不能为空")
    @DecimalMin(value = "0.01", message = "放款金额必须大于0")
    private BigDecimal amount;
    
    private String bankAccount; // 银行账户
    private String farmerAccount; // 农户账户
    private String remark; // 备注
}
```

---

## 5. Repository层

### 5.1 LoanProductRepository

**路径**: `com.agriverse.bank.repository.LoanProductRepository`

```java
@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, String> {
    List<LoanProduct> findByStatus(LoanProduct.ProductStatus status);
    
    @Query("SELECT p FROM LoanProduct p WHERE p.status = 'ACTIVE' " +
           "AND :amount >= p.minAmount AND :amount <= p.maxAmount " +
           "AND :termMonths = p.termMonths")
    List<LoanProduct> findMatchingProducts(@Param("amount") BigDecimal amount, 
                                          @Param("termMonths") Integer termMonths);
}
```

### 5.2 FinancingApplicationRepository

**路径**: `com.agriverse.finance.repository.FinancingApplicationRepository`

```java
@Repository
public interface FinancingApplicationRepository extends JpaRepository<FinancingApplication, String> {
    List<FinancingApplication> findByFarmerId(String farmerId);
    
    List<FinancingApplication> findByFarmerIdAndStatus(String farmerId, 
                                                       FinancingApplication.FinancingStatus status);
    
    List<FinancingApplication> findByStatus(FinancingApplication.FinancingStatus status);
    
    @Query("SELECT f FROM FinancingApplication f WHERE f.status IN :statuses " +
           "ORDER BY f.createdAt DESC")
    List<FinancingApplication> findByStatusIn(@Param("statuses") List<FinancingApplication.FinancingStatus> statuses);
    
    @Query("SELECT COUNT(f) FROM FinancingApplication f WHERE f.farmerId = :farmerId " +
           "AND f.status = 'REPAYING'")
    Long countActiveLoans(@Param("farmerId") String farmerId);
}
```

### 5.3 FinancingTimelineRepository

**路径**: `com.agriverse.finance.repository.FinancingTimelineRepository`

```java
@Repository
public interface FinancingTimelineRepository extends JpaRepository<FinancingTimeline, String> {
    List<FinancingTimeline> findByFinancingIdOrderByCreatedAtAsc(String financingId);
}
```

### 5.4 RepaymentScheduleRepository

**路径**: `com.agriverse.finance.repository.RepaymentScheduleRepository`

```java
@Repository
public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, String> {
    List<RepaymentSchedule> findByFinancingIdOrderByInstallmentNumberAsc(String financingId);
    
    List<RepaymentSchedule> findByFinancingIdAndStatus(String financingId, 
                                                        RepaymentSchedule.ScheduleStatus status);
    
    @Query("SELECT r FROM RepaymentSchedule r WHERE r.dueDate < :date " +
           "AND r.status = 'PENDING'")
    List<RepaymentSchedule> findOverdueSchedules(@Param("date") LocalDate date);
}
```

### 5.5 RepaymentRecordRepository

**路径**: `com.agriverse.finance.repository.RepaymentRecordRepository`

```java
@Repository
public interface RepaymentRecordRepository extends JpaRepository<RepaymentRecord, String> {
    List<RepaymentRecord> findByFinancingIdOrderByPaidAtDesc(String financingId);
    
    @Query("SELECT SUM(r.amount) FROM RepaymentRecord r WHERE r.financingId = :financingId")
    BigDecimal getTotalRepaidAmount(@Param("financingId") String financingId);
}
```

### 5.6 ContractRepository

**路径**: `com.agriverse.finance.repository.ContractRepository`

```java
@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    Optional<Contract> findByFinancingId(String financingId);
    
    Optional<Contract> findByContractNo(String contractNo);
    
    List<Contract> findByStatus(Contract.ContractStatus status);
}
```

### 5.7 JointLoanGroupRepository

**路径**: `com.agriverse.finance.repository.JointLoanGroupRepository`

```java
@Repository
public interface JointLoanGroupRepository extends JpaRepository<JointLoanGroup, String> {
    List<JointLoanGroup> findByStatus(JointLoanGroup.GroupStatus status);
    
    List<JointLoanGroup> findByCreatedBy(String createdBy);
}
```

### 5.8 JointLoanMemberRepository

**路径**: `com.agriverse.finance.repository.JointLoanMemberRepository`

```java
@Repository
public interface JointLoanMemberRepository extends JpaRepository<JointLoanMember, String> {
    List<JointLoanMember> findByGroupId(String groupId);
    
    List<JointLoanMember> findByFarmerId(String farmerId);
    
    @Query("SELECT SUM(m.amount) FROM JointLoanMember m WHERE m.groupId = :groupId " +
           "AND m.status = 'CONFIRMED'")
    BigDecimal getTotalConfirmedAmount(@Param("groupId") String groupId);
}
```

### 5.9 CreditScoreRepository

**路径**: `com.agriverse.bank.repository.CreditScoreRepository`

```java
@Repository
public interface CreditScoreRepository extends JpaRepository<CreditScore, String> {
    Optional<CreditScore> findByFinancingId(String financingId);
    
    List<CreditScore> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
}
```

### 5.10 DisbursementRepository

**路径**: `com.agriverse.bank.repository.DisbursementRepository`

```java
@Repository
public interface DisbursementRepository extends JpaRepository<Disbursement, String> {
    Optional<Disbursement> findByFinancingId(String financingId);
    
    List<Disbursement> findByStatus(Disbursement.DisbursementStatus status);
    
    @Query("SELECT SUM(d.amount) FROM Disbursement d WHERE d.status = 'SUCCESS' " +
           "AND d.disbursedAt >= :startDate AND d.disbursedAt <= :endDate")
    BigDecimal getTotalDisbursedAmount(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);
}
```

---

## 6. Service层

### 6.1 LoanProductService (贷款产品服务)

**路径**: `com.agriverse.bank.service.LoanProductService`

**主要方法**:

```java
@Service
@RequiredArgsConstructor
public class LoanProductService {
    private final LoanProductRepository productRepository;
    
    /**
     * 创建贷款产品
     */
    public LoanProduct createProduct(LoanProductRequest request, String createdBy) {
        // 验证金额范围
        if (request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
            throw new IllegalArgumentException("最小金额不能大于最大金额");
        }
        
        LoanProduct product = new LoanProduct();
        product.setId(UUID.randomUUID().toString());
        product.setName(request.getName());
        product.setRate(request.getRate());
        product.setMinAmount(request.getMinAmount());
        product.setMaxAmount(request.getMaxAmount());
        product.setTermMonths(request.getTermMonths());
        product.setDescription(request.getDescription());
        product.setStatus(LoanProduct.ProductStatus.ACTIVE);
        product.setCreatedBy(createdBy);
        
        return productRepository.save(product);
    }
    
    /**
     * 更新贷款产品
     */
    public LoanProduct updateProduct(String id, LoanProductRequest request) {
        LoanProduct product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("产品不存在"));
        
        product.setName(request.getName());
        product.setRate(request.getRate());
        product.setMinAmount(request.getMinAmount());
        product.setMaxAmount(request.getMaxAmount());
        product.setTermMonths(request.getTermMonths());
        product.setDescription(request.getDescription());
        
        return productRepository.save(product);
    }
    
    /**
     * 删除贷款产品
     */
    public void deleteProduct(String id) {
        LoanProduct product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("产品不存在"));
        product.setStatus(LoanProduct.ProductStatus.INACTIVE);
        productRepository.save(product);
    }
    
    /**
     * 获取所有启用的产品
     */
    public List<LoanProduct> getActiveProducts() {
        return productRepository.findByStatus(LoanProduct.ProductStatus.ACTIVE);
    }
    
    /**
     * 根据金额和期限匹配产品
     */
    public List<LoanProduct> findMatchingProducts(BigDecimal amount, Integer termMonths) {
        return productRepository.findMatchingProducts(amount, termMonths);
    }
}
```

### 6.2 FinancingApplicationService (融资申请服务)

**路径**: `com.agriverse.finance.service.FinancingApplicationService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class FinancingApplicationService {
    private final FinancingApplicationRepository applicationRepository;
    private final FinancingTimelineRepository timelineRepository;
    private final LoanProductRepository productRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final JointLoanGroupRepository jointLoanGroupRepository;
    
    /**
     * 创建融资申请
     */
    public FinancingApplication createApplication(FinancingApplicationRequest request, String farmerId) {
        // 检查是否有最低额度限制
        List<LoanProduct> products = productRepository.findByStatus(LoanProduct.ProductStatus.ACTIVE);
        if (products.isEmpty()) {
            throw new BusinessException("暂无可用的贷款产品");
        }
        
        BigDecimal minAmount = products.stream()
            .map(LoanProduct::getMinAmount)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.valueOf(200000));
        
        // 如果金额低于最低额度，返回特殊标识，前端引导进入拼单流程
        if (request.getAmount().compareTo(minAmount) < 0) {
            throw new BusinessException("APPLY_JOINT_LOAN", "申请金额低于最低额度，建议使用智能拼单");
        }
        
        FinancingApplication application = new FinancingApplication();
        application.setId(UUID.randomUUID().toString());
        application.setFarmerId(farmerId);
        application.setProductId(request.getProductId());
        application.setAmount(request.getAmount());
        application.setTermMonths(request.getTermMonths());
        application.setPurpose(request.getPurpose());
        application.setStatus(FinancingApplication.FinancingStatus.APPLIED);
        
        FinancingApplication saved = applicationRepository.save(application);
        
        // 创建时间线记录
        addTimeline(saved.getId(), FinancingTimeline.ActorType.FARMER, farmerId, 
                   "提交融资申请", request.getPurpose());
        
        return saved;
    }
    
    /**
     * 获取农户的融资申请列表
     */
    public List<FinancingApplication> getFarmerApplications(String farmerId, String status) {
        if (status != null && !status.isEmpty()) {
            FinancingApplication.FinancingStatus statusEnum = 
                FinancingApplication.FinancingStatus.valueOf(status);
            return applicationRepository.findByFarmerIdAndStatus(farmerId, statusEnum);
        }
        return applicationRepository.findByFarmerId(farmerId);
    }
    
    /**
     * 获取融资申请详情
     */
    public FinancingApplication getApplicationById(String id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
    }
    
    /**
     * 添加时间线记录
     */
    public void addTimeline(String financingId, FinancingTimeline.ActorType actor, 
                           String actorId, String action, String note) {
        FinancingTimeline timeline = new FinancingTimeline();
        timeline.setId(UUID.randomUUID().toString());
        timeline.setFinancingId(financingId);
        timeline.setActor(actor);
        timeline.setActorId(actorId);
        timeline.setAction(action);
        timeline.setNote(note);
        timelineRepository.save(timeline);
    }
    
    /**
     * 生成还款计划（等额本息）
     */
    public List<RepaymentSchedule> generateRepaymentSchedule(FinancingApplication application) {
        BigDecimal amount = application.getAmount();
        BigDecimal rate = application.getInterestRate().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        int termMonths = application.getTermMonths();
        
        // 等额本息计算公式：每月还款额 = [贷款本金×月利率×(1+月利率)^还款月数]÷[(1+月利率)^还款月数－1]
        BigDecimal monthlyRate = rate.divide(BigDecimal.valueOf(12), 6, RoundingMode.HALF_UP);
        BigDecimal pow = BigDecimal.valueOf(Math.pow(monthlyRate.add(BigDecimal.ONE).doubleValue(), termMonths));
        BigDecimal monthlyPayment = amount.multiply(monthlyRate).multiply(pow)
            .divide(pow.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal remainingPrincipal = amount;
        LocalDate startDate = LocalDate.now();
        
        for (int i = 1; i <= termMonths; i++) {
            RepaymentSchedule schedule = new RepaymentSchedule();
            schedule.setId(UUID.randomUUID().toString());
            schedule.setFinancingId(application.getId());
            schedule.setInstallmentNumber(i);
            schedule.setDueDate(startDate.plusMonths(i));
            
            // 计算利息
            BigDecimal interest = remainingPrincipal.multiply(monthlyRate)
                .setScale(2, RoundingMode.HALF_UP);
            
            // 计算本金
            BigDecimal principal = monthlyPayment.subtract(interest);
            if (i == termMonths) {
                // 最后一期，本金 = 剩余本金
                principal = remainingPrincipal;
            }
            
            schedule.setPrincipal(principal);
            schedule.setInterest(interest);
            schedule.setTotalAmount(monthlyPayment);
            schedule.setStatus(RepaymentSchedule.ScheduleStatus.PENDING);
            
            remainingPrincipal = remainingPrincipal.subtract(principal);
            schedules.add(schedule);
        }
        
        return scheduleRepository.saveAll(schedules);
    }
}
```

### 6.3 BankApprovalService (银行审批服务)

**路径**: `com.agriverse.bank.service.BankApprovalService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class BankApprovalService {
    private final FinancingApplicationRepository applicationRepository;
    private final FinancingTimelineRepository timelineRepository;
    private final CreditScoreRepository creditScoreRepository;
    private final FinancingApplicationService financingApplicationService;
    
    /**
     * 获取待审批列表
     */
    public List<FinancingApplication> getPendingApplications() {
        return applicationRepository.findByStatus(FinancingApplication.FinancingStatus.APPLIED);
    }
    
    /**
     * 审批融资申请
     */
    public FinancingApplication approveApplication(ApprovalRequest request, String reviewerId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.APPLIED &&
            application.getStatus() != FinancingApplication.FinancingStatus.REVIEWING) {
            throw new BusinessException("当前状态不允许审批");
        }
        
        if ("APPROVE".equals(request.getAction())) {
            application.setStatus(FinancingApplication.FinancingStatus.APPROVED);
            application.setReviewerId(reviewerId);
            application.setReviewedAt(LocalDateTime.now());
            application.setReviewComment(request.getReviewComment());
            application.setCreditScore(request.getCreditScore());
            application.setInterestRate(request.getInterestRate());
            
            // 生成还款计划
            financingApplicationService.generateRepaymentSchedule(application);
            
            // 添加时间线
            financingApplicationService.addTimeline(application.getId(), 
                FinancingTimeline.ActorType.BANK, reviewerId, "审批通过", request.getReviewComment());
        } else if ("REJECT".equals(request.getAction())) {
            application.setStatus(FinancingApplication.FinancingStatus.REJECTED);
            application.setReviewerId(reviewerId);
            application.setReviewedAt(LocalDateTime.now());
            application.setReviewComment(request.getReviewComment());
            
            // 添加时间线
            financingApplicationService.addTimeline(application.getId(), 
                FinancingTimeline.ActorType.BANK, reviewerId, "审批拒绝", request.getReviewComment());
        }
        
        return applicationRepository.save(application);
    }
    
    /**
     * 计算信用评分
     */
    public CreditScore calculateCreditScore(CreditScoreRequest request, String reviewerId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        // 计算各项评分
        int creditHistoryScore = request.getCreditHistoryScore() != null ? 
            request.getCreditHistoryScore() : 70;
        
        // 收入评分：年收入/10000，最高50分
        int incomeScore = Math.min(request.getIncome().divide(BigDecimal.valueOf(10000), 0, RoundingMode.DOWN).intValue(), 50);
        
        // 资产评分：资产总额/100000，最高30分
        int assetScore = Math.min(request.getAssets().divide(BigDecimal.valueOf(100000), 0, RoundingMode.DOWN).intValue(), 30);
        
        // 负债率评分：(100 - 负债率) * 0.15
        int debtRatioScore = (100 - request.getDebtRatio()) * 15 / 100;
        
        int experienceScore = request.getIndustryExperience() != null ? 
            request.getIndustryExperience() : 70;
        
        // 综合评分
        int totalScore = (int)(creditHistoryScore * 0.3 + incomeScore * 0.2 + 
                              assetScore * 0.2 + debtRatioScore * 0.15 + experienceScore * 0.15);
        
        // 风险等级
        CreditScore.RiskLevel riskLevel;
        if (totalScore >= 80) {
            riskLevel = CreditScore.RiskLevel.LOW;
        } else if (totalScore >= 60) {
            riskLevel = CreditScore.RiskLevel.MEDIUM;
        } else {
            riskLevel = CreditScore.RiskLevel.HIGH;
        }
        
        // 建议额度
        BigDecimal suggestedAmount = BigDecimal.valueOf(totalScore * 1000);
        
        CreditScore creditScore = new CreditScore();
        creditScore.setId(UUID.randomUUID().toString());
        creditScore.setFinancingId(request.getFinancingId());
        creditScore.setFarmerId(application.getFarmerId());
        creditScore.setCreditHistoryScore(creditHistoryScore);
        creditScore.setIncomeScore(incomeScore);
        creditScore.setAssetScore(assetScore);
        creditScore.setDebtRatioScore(debtRatioScore);
        creditScore.setExperienceScore(experienceScore);
        creditScore.setTotalScore(totalScore);
        creditScore.setRiskLevel(riskLevel);
        creditScore.setSuggestedAmount(suggestedAmount);
        creditScore.setReviewerId(reviewerId);
        creditScore.setReviewedAt(LocalDateTime.now());
        
        return creditScoreRepository.save(creditScore);
    }
}
```

### 6.4 ContractService (合同服务)

**路径**: `com.agriverse.finance.service.ContractService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ContractService {
    private final ContractRepository contractRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    
    /**
     * 生成合同
     */
    public Contract generateContract(ContractGenerateRequest request) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.APPROVED) {
            throw new BusinessException("只有已审批通过的申请才能生成合同");
        }
        
        User farmer = userRepository.findById(application.getFarmerId())
            .orElseThrow(() -> new EntityNotFoundException("农户不存在"));
        
        Contract contract = new Contract();
        contract.setId(UUID.randomUUID().toString());
        contract.setFinancingId(application.getId());
        contract.setFarmerId(application.getFarmerId());
        contract.setFarmerName(farmer.getName());
        contract.setFarmerIdCard(farmer.getIdCard());
        contract.setBankName(request.getBankName() != null ? request.getBankName() : "中国农业银行");
        contract.setAmount(application.getAmount());
        contract.setInterestRate(application.getInterestRate());
        contract.setTermMonths(application.getTermMonths());
        contract.setPurpose(application.getPurpose());
        contract.setStartDate(LocalDate.now());
        contract.setEndDate(LocalDate.now().plusMonths(application.getTermMonths()));
        contract.setRepaymentMethod("等额本息");
        contract.setStatus(Contract.ContractStatus.DRAFT);
        
        // 生成合同内容（JSON格式）
        Map<String, Object> contractContent = new HashMap<>();
        contractContent.put("parties", Map.of(
            "borrower", farmer.getName(),
            "lender", contract.getBankName()
        ));
        contractContent.put("amount", application.getAmount());
        contractContent.put("interestRate", application.getInterestRate());
        contractContent.put("termMonths", application.getTermMonths());
        contractContent.put("purpose", application.getPurpose());
        
        contract.setContractContent(new ObjectMapper().writeValueAsString(contractContent));
        
        Contract saved = contractRepository.save(contract);
        
        // 更新申请状态
        application.setContractId(saved.getId());
        applicationRepository.save(application);
        
        return saved;
    }
    
    /**
     * 农户签署合同
     */
    public Contract signContractByFarmer(String contractId, String signatureUrl) {
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        contract.setFarmerSignatureUrl(signatureUrl);
        contract.setFarmerSignedAt(LocalDateTime.now());
        
        // 如果双方都已签署，更新状态
        if (contract.getBankSignedAt() != null) {
            contract.setStatus(Contract.ContractStatus.SIGNED);
            
            // 更新融资申请状态
            FinancingApplication application = applicationRepository.findById(contract.getFinancingId())
                .orElseThrow();
            application.setStatus(FinancingApplication.FinancingStatus.SIGNED);
            application.setSignedAt(LocalDateTime.now());
            applicationRepository.save(application);
        }
        
        return contractRepository.save(contract);
    }
    
    /**
     * 银行签署合同
     */
    public Contract signContractByBank(String contractId, String signatureUrl) {
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        contract.setBankSignatureUrl(signatureUrl);
        contract.setBankSignedAt(LocalDateTime.now());
        
        // 如果双方都已签署，更新状态
        if (contract.getFarmerSignedAt() != null) {
            contract.setStatus(Contract.ContractStatus.SIGNED);
            
            // 更新融资申请状态
            FinancingApplication application = applicationRepository.findById(contract.getFinancingId())
                .orElseThrow();
            application.setStatus(FinancingApplication.FinancingStatus.SIGNED);
            application.setSignedAt(LocalDateTime.now());
            applicationRepository.save(application);
        }
        
        return contractRepository.save(contract);
    }
}
```

### 6.5 RepaymentService (还款服务)

**路径**: `com.agriverse.finance.service.RepaymentService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class RepaymentService {
    private final RepaymentRecordRepository repaymentRecordRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 正常还款
     */
    public RepaymentRecord repay(RepaymentRequest request) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        RepaymentSchedule schedule = scheduleRepository.findById(request.getScheduleId())
            .orElseThrow(() -> new EntityNotFoundException("还款计划不存在"));
        
        if (schedule.getStatus() == RepaymentSchedule.ScheduleStatus.PAID) {
            throw new BusinessException("该期已还款");
        }
        
        // 创建还款记录
        RepaymentRecord record = new RepaymentRecord();
        record.setId(UUID.randomUUID().toString());
        record.setFinancingId(request.getFinancingId());
        record.setScheduleId(request.getScheduleId());
        record.setRepaymentType(RepaymentRecord.RepaymentType.NORMAL);
        record.setAmount(request.getAmount());
        record.setPrincipal(schedule.getPrincipal());
        record.setInterest(schedule.getInterest());
        record.setPenalty(BigDecimal.ZERO);
        record.setPaymentMethod(request.getPaymentMethod());
        record.setTransactionId(request.getTransactionId());
        record.setPaidAt(LocalDateTime.now());
        
        // 更新还款计划状态
        schedule.setStatus(RepaymentSchedule.ScheduleStatus.PAID);
        schedule.setPaidAt(LocalDateTime.now());
        schedule.setPaidAmount(request.getAmount());
        scheduleRepository.save(schedule);
        
        // 检查是否全部还清
        List<RepaymentSchedule> allSchedules = scheduleRepository.findByFinancingId(request.getFinancingId());
        boolean allPaid = allSchedules.stream()
            .allMatch(s -> s.getStatus() == RepaymentSchedule.ScheduleStatus.PAID);
        
        if (allPaid) {
            application.setStatus(FinancingApplication.FinancingStatus.SETTLED);
            applicationRepository.save(application);
        } else {
            application.setStatus(FinancingApplication.FinancingStatus.REPAYING);
            applicationRepository.save(application);
        }
        
        return repaymentRecordRepository.save(record);
    }
    
    /**
     * 提前还款试算
     */
    public Map<String, Object> calculateEarlyRepayment(EarlyRepaymentCalculateRequest request) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        List<RepaymentSchedule> schedules = scheduleRepository
            .findByFinancingIdAndStatus(request.getFinancingId(), RepaymentSchedule.ScheduleStatus.PENDING);
        
        // 计算剩余本金
        BigDecimal remainingPrincipal = schedules.stream()
            .map(RepaymentSchedule::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算提前还款违约金（假设为剩余本金的1%）
        BigDecimal penalty = remainingPrincipal.multiply(BigDecimal.valueOf(0.01));
        
        // 计算总还款金额
        BigDecimal totalAmount = request.getAmount().add(penalty);
        
        Map<String, Object> result = new HashMap<>();
        result.put("remainingPrincipal", remainingPrincipal);
        result.put("penalty", penalty);
        result.put("totalAmount", totalAmount);
        result.put("savedInterest", schedules.stream()
            .map(RepaymentSchedule::getInterest)
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return result;
    }
}
```

### 6.6 DisbursementService (放款服务)

**路径**: `com.agriverse.bank.service.DisbursementService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class DisbursementService {
    private final DisbursementRepository disbursementRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final ContractRepository contractRepository;
    
    /**
     * 放款
     */
    public Disbursement disburse(DisbursementRequest request, String operatorId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.SIGNED) {
            throw new BusinessException("只有已签约的申请才能放款");
        }
        
        Contract contract = contractRepository.findById(request.getContractId())
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        if (contract.getStatus() != Contract.ContractStatus.SIGNED) {
            throw new BusinessException("合同未签署");
        }
        
        Disbursement disbursement = new Disbursement();
        disbursement.setId(UUID.randomUUID().toString());
        disbursement.setFinancingId(request.getFinancingId());
        disbursement.setContractId(request.getContractId());
        disbursement.setAmount(request.getAmount());
        disbursement.setBankAccount(request.getBankAccount());
        disbursement.setFarmerAccount(request.getFarmerAccount());
        disbursement.setStatus(Disbursement.DisbursementStatus.PENDING);
        disbursement.setDisbursedBy(operatorId);
        disbursement.setRemark(request.getRemark());
        
        // TODO: 调用支付接口进行实际放款
        // 这里模拟放款成功
        disbursement.setStatus(Disbursement.DisbursementStatus.SUCCESS);
        disbursement.setDisbursedAt(LocalDateTime.now());
        disbursement.setTransactionId("TXN" + System.currentTimeMillis());
        
        Disbursement saved = disbursementRepository.save(disbursement);
        
        // 更新融资申请状态
        application.setStatus(FinancingApplication.FinancingStatus.DISBURSED);
        application.setDisbursedAt(LocalDateTime.now());
        application.setDisbursedAmount(request.getAmount());
        applicationRepository.save(application);
        
        return saved;
    }
    
    /**
     * 获取放款列表
     */
    public List<Disbursement> getDisbursements(String status) {
        if (status != null && !status.isEmpty()) {
            Disbursement.DisbursementStatus statusEnum = 
                Disbursement.DisbursementStatus.valueOf(status);
            return disbursementRepository.findByStatus(statusEnum);
        }
        return disbursementRepository.findAll();
    }
}
```

### 6.7 JointLoanService (智能拼单服务)

**路径**: `com.agriverse.finance.service.JointLoanService`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class JointLoanService {
    private final JointLoanGroupRepository groupRepository;
    private final JointLoanMemberRepository memberRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    
    /**
     * 创建拼单组
     */
    public JointLoanGroup createGroup(BigDecimal amount, String farmerId) {
        JointLoanGroup group = new JointLoanGroup();
        group.setId(UUID.randomUUID().toString());
        group.setGroupName("智能拼单组-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        group.setTotalAmount(amount);
        group.setMinAmount(BigDecimal.valueOf(200000)); // 最低拼单金额
        group.setStatus(JointLoanGroup.GroupStatus.MATCHING);
        group.setMatchedCount(1);
        group.setTargetCount(calculateTargetCount(amount));
        group.setCreatedBy(farmerId);
        
        return groupRepository.save(group);
    }
    
    /**
     * 加入拼单组
     */
    public JointLoanMember joinGroup(String groupId, String farmerId, BigDecimal amount, String purpose) {
        JointLoanGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
        
        if (group.getStatus() != JointLoanGroup.GroupStatus.MATCHING) {
            throw new BusinessException("该拼单组已不可加入");
        }
        
        JointLoanMember member = new JointLoanMember();
        member.setId(UUID.randomUUID().toString());
        member.setGroupId(groupId);
        member.setFarmerId(farmerId);
        member.setAmount(amount);
        member.setPurpose(purpose);
        member.setStatus(JointLoanMember.MemberStatus.PENDING);
        
        JointLoanMember saved = memberRepository.save(member);
        
        // 更新拼单组状态
        BigDecimal totalAmount = memberRepository.getTotalConfirmedAmount(groupId)
            .add(amount);
        
        if (totalAmount.compareTo(group.getMinAmount()) >= 0) {
            group.setStatus(JointLoanGroup.GroupStatus.MATCHED);
        }
        
        group.setMatchedCount(group.getMatchedCount() + 1);
        groupRepository.save(group);
        
        return saved;
    }
    
    /**
     * 确认拼单并提交申请
     */
    public List<FinancingApplication> confirmAndApply(String groupId) {
        JointLoanGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
        
        List<JointLoanMember> members = memberRepository.findByGroupId(groupId);
        members = members.stream()
            .filter(m -> m.getStatus() == JointLoanMember.MemberStatus.PENDING)
            .collect(Collectors.toList());
        
        List<FinancingApplication> applications = new ArrayList<>();
        
        for (JointLoanMember member : members) {
            member.setStatus(JointLoanMember.MemberStatus.CONFIRMED);
            memberRepository.save(member);
            
            // 为每个成员创建融资申请
            FinancingApplication application = new FinancingApplication();
            application.setId(UUID.randomUUID().toString());
            application.setFarmerId(member.getFarmerId());
            application.setAmount(member.getAmount());
            application.setTermMonths(12); // 默认12个月
            application.setPurpose(member.getPurpose());
            application.setStatus(FinancingApplication.FinancingStatus.APPLIED);
            
            FinancingApplication saved = applicationRepository.save(application);
            member.setFinancingId(saved.getId());
            memberRepository.save(member);
            
            applications.add(saved);
        }
        
        group.setStatus(JointLoanGroup.GroupStatus.APPLIED);
        groupRepository.save(group);
        
        return applications;
    }
    
    /**
     * 计算目标农户数
     */
    private Integer calculateTargetCount(BigDecimal amount) {
        BigDecimal minAmount = BigDecimal.valueOf(200000);
        return amount.divide(minAmount, 0, RoundingMode.UP).intValue();
    }
}
```

---

## 7. Controller层

### 7.1 FarmerFinanceController (农户融资控制器)

**路径**: `com.agriverse.finance.controller.FarmerFinanceController`

```java
@RestController
@RequestMapping("/farmer/finance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerFinanceController {
    private final FinancingApplicationService applicationService;
    private final RepaymentService repaymentService;
    private final ContractService contractService;
    private final JointLoanService jointLoanService;
    
    /**
     * 提交融资申请
     */
    @PostMapping("/apply")
    public ApiResponse<FinancingApplicationResponse> apply(@Valid @RequestBody FinancingApplicationRequest request,
                                                          Authentication authentication) {
        String farmerId = authentication.getName();
        try {
            FinancingApplication application = applicationService.createApplication(request, farmerId);
            return ApiResponse.success(convertToResponse(application));
        } catch (BusinessException e) {
            if ("APPLY_JOINT_LOAN".equals(e.getCode())) {
                return ApiResponse.error("APPLY_JOINT_LOAN", e.getMessage());
            }
            throw e;
        }
    }
    
    /**
     * 获取我的融资申请列表
     */
    @GetMapping("/applications")
    public ApiResponse<List<FinancingApplicationResponse>> getMyApplications(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        String farmerId = authentication.getName();
        List<FinancingApplication> applications = applicationService.getFarmerApplications(farmerId, status);
        return ApiResponse.success(applications.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList()));
    }
    
    /**
     * 获取融资申请详情
     */
    @GetMapping("/applications/{id}")
    public ApiResponse<FinancingApplicationResponse> getApplication(@PathVariable String id) {
        FinancingApplication application = applicationService.getApplicationById(id);
        return ApiResponse.success(convertToResponse(application));
    }
    
    /**
     * 还款
     */
    @PostMapping("/repay")
    public ApiResponse<RepaymentRecord> repay(@Valid @RequestBody RepaymentRequest request) {
        RepaymentRecord record = repaymentService.repay(request);
        return ApiResponse.success(record);
    }
    
    /**
     * 提前还款试算
     */
    @PostMapping("/early-repay/calculate")
    public ApiResponse<Map<String, Object>> calculateEarlyRepayment(
            @Valid @RequestBody EarlyRepaymentCalculateRequest request) {
        Map<String, Object> result = repaymentService.calculateEarlyRepayment(request);
        return ApiResponse.success(result);
    }
    
    /**
     * 签署合同
     */
    @PostMapping("/contracts/{contractId}/sign")
    public ApiResponse<Contract> signContract(@PathVariable String contractId,
                                              @RequestParam String signatureUrl,
                                              Authentication authentication) {
        Contract contract = contractService.signContractByFarmer(contractId, signatureUrl);
        return ApiResponse.success(contract);
    }
    
    /**
     * 创建拼单组
     */
    @PostMapping("/joint-loan/create")
    public ApiResponse<JointLoanGroup> createJointLoanGroup(@RequestParam BigDecimal amount,
                                                           Authentication authentication) {
        String farmerId = authentication.getName();
        JointLoanGroup group = jointLoanService.createGroup(amount, farmerId);
        return ApiResponse.success(group);
    }
    
    /**
     * 加入拼单组
     */
    @PostMapping("/joint-loan/{groupId}/join")
    public ApiResponse<JointLoanMember> joinGroup(@PathVariable String groupId,
                                                 @RequestParam BigDecimal amount,
                                                 @RequestParam String purpose,
                                                 Authentication authentication) {
        String farmerId = authentication.getName();
        JointLoanMember member = jointLoanService.joinGroup(groupId, farmerId, amount, purpose);
        return ApiResponse.success(member);
    }
    
    /**
     * 确认拼单并提交申请
     */
    @PostMapping("/joint-loan/{groupId}/confirm")
    public ApiResponse<List<FinancingApplicationResponse>> confirmJointLoan(@PathVariable String groupId) {
        List<FinancingApplication> applications = jointLoanService.confirmAndApply(groupId);
        return ApiResponse.success(applications.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList()));
    }
    
    private FinancingApplicationResponse convertToResponse(FinancingApplication application) {
        // 转换逻辑
        FinancingApplicationResponse response = new FinancingApplicationResponse();
        response.setId(application.getId());
        response.setFarmerId(application.getFarmerId());
        response.setAmount(application.getAmount());
        response.setTermMonths(application.getTermMonths());
        response.setPurpose(application.getPurpose());
        response.setStatus(application.getStatus().name());
        response.setInterestRate(application.getInterestRate());
        response.setCreditScore(application.getCreditScore());
        response.setCreatedAt(application.getCreatedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        // 加载时间线和还款计划
        // ...
        return response;
    }
}
```

### 7.2 BankLoanController (银行贷款控制器)

**路径**: `com.agriverse.bank.controller.BankLoanController`

```java
@RestController
@RequestMapping("/bank/loan")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BANK')")
public class BankLoanController {
    private final LoanProductService productService;
    private final BankApprovalService approvalService;
    private final ContractService contractService;
    private final DisbursementService disbursementService;
    
    /**
     * 创建贷款产品
     */
    @PostMapping("/products")
    public ApiResponse<LoanProduct> createProduct(@Valid @RequestBody LoanProductRequest request,
                                                   Authentication authentication) {
        String createdBy = authentication.getName();
        LoanProduct product = productService.createProduct(request, createdBy);
        return ApiResponse.success(product);
    }
    
    /**
     * 更新贷款产品
     */
    @PutMapping("/products/{id}")
    public ApiResponse<LoanProduct> updateProduct(@PathVariable String id,
                                                  @Valid @RequestBody LoanProductRequest request) {
        LoanProduct product = productService.updateProduct(id, request);
        return ApiResponse.success(product);
    }
    
    /**
     * 删除贷款产品
     */
    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null);
    }
    
    /**
     * 获取产品列表
     */
    @GetMapping("/products")
    public ApiResponse<List<LoanProduct>> getProducts() {
        List<LoanProduct> products = productService.getActiveProducts();
        return ApiResponse.success(products);
    }
    
    /**
     * 获取待审批列表
     */
    @GetMapping("/approvals/pending")
    public ApiResponse<List<FinancingApplication>> getPendingApprovals() {
        List<FinancingApplication> applications = approvalService.getPendingApplications();
        return ApiResponse.success(applications);
    }
    
    /**
     * 审批申请
     */
    @PostMapping("/approvals")
    public ApiResponse<FinancingApplication> approve(@Valid @RequestBody ApprovalRequest request,
                                                     Authentication authentication) {
        String reviewerId = authentication.getName();
        FinancingApplication application = approvalService.approveApplication(request, reviewerId);
        return ApiResponse.success(application);
    }
    
    /**
     * 计算信用评分
     */
    @PostMapping("/credit-score/calculate")
    public ApiResponse<CreditScore> calculateCreditScore(@Valid @RequestBody CreditScoreRequest request,
                                                         Authentication authentication) {
        String reviewerId = authentication.getName();
        CreditScore creditScore = approvalService.calculateCreditScore(request, reviewerId);
        return ApiResponse.success(creditScore);
    }
    
    /**
     * 生成合同
     */
    @PostMapping("/contracts/generate")
    public ApiResponse<Contract> generateContract(@Valid @RequestBody ContractGenerateRequest request) {
        Contract contract = contractService.generateContract(request);
        return ApiResponse.success(contract);
    }
    
    /**
     * 银行签署合同
     */
    @PostMapping("/contracts/{contractId}/sign")
    public ApiResponse<Contract> signContract(@PathVariable String contractId,
                                             @RequestParam String signatureUrl) {
        Contract contract = contractService.signContractByBank(contractId, signatureUrl);
        return ApiResponse.success(contract);
    }
    
    /**
     * 放款
     */
    @PostMapping("/disburse")
    public ApiResponse<Disbursement> disburse(@Valid @RequestBody DisbursementRequest request,
                                             Authentication authentication) {
        String operatorId = authentication.getName();
        Disbursement disbursement = disbursementService.disburse(request, operatorId);
        return ApiResponse.success(disbursement);
    }
    
    /**
     * 获取放款列表
     */
    @GetMapping("/disbursements")
    public ApiResponse<List<Disbursement>> getDisbursements(@RequestParam(required = false) String status) {
        List<Disbursement> disbursements = disbursementService.getDisbursements(status);
        return ApiResponse.success(disbursements);
    }
}
```

---

## 8. 业务流程说明

### 8.1 农户融资申请流程

```
1. 农户提交融资申请
   ├─ 填写：金额、期限、用途
   ├─ 系统检查金额是否低于最低额度
   │  ├─ 低于最低额度 → 引导进入智能拼单流程
   │  └─ 符合要求 → 创建融资申请（状态：APPLIED）
   │
2. 银行审批
   ├─ 银行查看待审批列表
   ├─ 查看申请详情
   ├─ 计算信用评分（可选）
   ├─ 审批决策
   │  ├─ 批准 → 状态：APPROVED，生成还款计划
   │  └─ 拒绝 → 状态：REJECTED
   │
3. 合同签署
   ├─ 银行生成合同（状态：DRAFT）
   ├─ 农户签署合同
   ├─ 银行签署合同
   └─ 双方签署完成 → 状态：SIGNED
   │
4. 放款
   ├─ 银行执行放款操作
   ├─ 更新融资申请状态：DISBURSED
   └─ 创建放款记录
   │
5. 还款
   ├─ 农户查看还款计划
   ├─ 按期还款或提前还款
   ├─ 系统更新还款计划状态
   └─ 全部还清 → 状态：SETTLED
```

### 8.2 智能拼单流程

```
1. 农户申请金额低于最低额度
   ├─ 系统提示进入智能拼单
   └─ 创建拼单组（状态：MATCHING）
   │
2. 匹配其他农户
   ├─ 系统推荐相似农户
   ├─ 农户选择加入拼单组
   └─ 更新拼单组状态
   │
3. 达到最低拼单金额
   ├─ 拼单组状态：MATCHED
   ├─ 农户确认拼单
   └─ 为每个成员创建融资申请
   │
4. 提交审批
   └─ 拼单组状态：APPLIED
   └─ 进入正常审批流程
```

### 8.3 银行审批流程

```
1. 查看待审批列表
   ├─ 筛选条件：状态、时间范围
   └─ 显示申请基本信息
   │
2. 查看申请详情
   ├─ 农户信息
   ├─ 申请金额、期限、用途
   ├─ 历史信用记录
   └─ 时间线记录
   │
3. 信用评分（可选）
   ├─ 填写评分指标
   ├─ 系统计算综合评分
   └─ 生成风险等级和建议额度
   │
4. 审批决策
   ├─ 批准
   │  ├─ 设置实际利率
   │  ├─ 记录信用评分
   │  ├─ 生成还款计划
   │  └─ 更新状态：APPROVED
   │
   └─ 拒绝
      ├─ 填写拒绝原因
      └─ 更新状态：REJECTED
```

### 8.4 还款计划生成算法（等额本息）

```
公式：
每月还款额 = [贷款本金 × 月利率 × (1+月利率)^还款月数] ÷ [(1+月利率)^还款月数 - 1]

计算步骤：
1. 月利率 = 年利率 / 12
2. 计算每月还款额（固定）
3. 每期计算：
   - 利息 = 剩余本金 × 月利率
   - 本金 = 每月还款额 - 利息
   - 剩余本金 = 剩余本金 - 本金
4. 最后一期：本金 = 剩余本金（处理精度问题）
```

---

## 9. API接口设计

### 9.1 农户模块接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/farmer/finance/apply` | 提交融资申请 | FARMER |
| GET | `/api/farmer/finance/applications` | 获取我的申请列表 | FARMER |
| GET | `/api/farmer/finance/applications/{id}` | 获取申请详情 | FARMER |
| POST | `/api/farmer/finance/repay` | 还款 | FARMER |
| POST | `/api/farmer/finance/early-repay/calculate` | 提前还款试算 | FARMER |
| POST | `/api/farmer/finance/contracts/{contractId}/sign` | 签署合同 | FARMER |
| POST | `/api/farmer/finance/joint-loan/create` | 创建拼单组 | FARMER |
| POST | `/api/farmer/finance/joint-loan/{groupId}/join` | 加入拼单组 | FARMER |
| POST | `/api/farmer/finance/joint-loan/{groupId}/confirm` | 确认拼单 | FARMER |

### 9.2 银行模块接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/bank/loan/products` | 创建贷款产品 | BANK |
| PUT | `/api/bank/loan/products/{id}` | 更新贷款产品 | BANK |
| DELETE | `/api/bank/loan/products/{id}` | 删除贷款产品 | BANK |
| GET | `/api/bank/loan/products` | 获取产品列表 | BANK |
| GET | `/api/bank/loan/approvals/pending` | 获取待审批列表 | BANK |
| POST | `/api/bank/loan/approvals` | 审批申请 | BANK |
| POST | `/api/bank/loan/credit-score/calculate` | 计算信用评分 | BANK |
| POST | `/api/bank/loan/contracts/generate` | 生成合同 | BANK |
| POST | `/api/bank/loan/contracts/{contractId}/sign` | 银行签署合同 | BANK |
| POST | `/api/bank/loan/disburse` | 放款 | BANK |
| GET | `/api/bank/loan/disbursements` | 获取放款列表 | BANK |

### 9.3 响应格式

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
   - 执行 SQL 脚本创建所有表
   - 验证表结构和索引

2. **创建实体类**
   - 按照文档创建所有实体类
   - 添加必要的注解和枚举
   - 实现 `@PrePersist` 和 `@PreUpdate` 方法

3. **创建 Repository 接口**
   - 继承 `JpaRepository`
   - 添加自定义查询方法

### 10.2 第二阶段：Service 层

1. **实现 LoanProductService**
   - 产品 CRUD 操作
   - 产品匹配逻辑

2. **实现 FinancingApplicationService**
   - 申请创建
   - 申请查询
   - 还款计划生成

3. **实现 BankApprovalService**
   - 审批流程
   - 信用评分计算

4. **实现 ContractService**
   - 合同生成
   - 合同签署

5. **实现 RepaymentService**
   - 正常还款
   - 提前还款试算

6. **实现 DisbursementService**
   - 放款操作
   - 放款记录查询

7. **实现 JointLoanService**
   - 拼单组管理
   - 拼单匹配逻辑

### 10.3 第三阶段：Controller 层

1. **实现 FarmerFinanceController**
   - 农户端所有接口
   - 参数验证
   - 异常处理

2. **实现 BankLoanController**
   - 银行端所有接口
   - 权限控制
   - 响应格式化

### 10.4 第四阶段：测试和优化

1. **单元测试**
   - Service 层测试
   - Repository 层测试

2. **集成测试**
   - Controller 层测试
   - 完整流程测试

3. **性能优化**
   - 数据库查询优化
   - 缓存策略
   - 并发控制

### 10.5 第五阶段：文档和部署

1. **API 文档**
   - 使用 Swagger 生成 API 文档
   - 补充接口说明

2. **部署准备**
   - 配置文件优化
   - 日志配置
   - 监控配置

---

## 11. 注意事项

### 11.1 数据一致性

- 使用 `@Transactional` 保证事务一致性
- 状态变更时更新相关记录
- 时间线记录要完整

### 11.2 安全性

- 所有接口需要 JWT 认证
- 权限控制使用 `@PreAuthorize`
- 敏感数据加密存储

### 11.3 性能考虑

- 大数据量查询使用分页
- 复杂计算考虑缓存
- 还款计划生成使用批量插入

### 11.4 异常处理

- 统一异常处理机制
- 友好的错误提示
- 记录异常日志

### 11.5 业务规则

- 金额验证（最小值、最大值）
- 状态流转验证
- 时间验证（还款日期、合同期限）

---

## 12. 扩展功能（后续实现）

1. **逾期管理**
   - 自动检测逾期
   - 逾期罚息计算
   - 逾期提醒

2. **对账中心**
   - 自动对账
   - 对账报表
   - 差异处理

3. **风控系统**
   - 风险评分模型
   - 风险预警
   - 黑名单管理

4. **报表统计**
   - 放款统计
   - 还款统计
   - 逾期统计

5. **消息通知**
   - 审批结果通知
   - 还款提醒
   - 合同签署提醒

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。
