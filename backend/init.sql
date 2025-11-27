-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    name VARCHAR(100) COMMENT '姓名',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    role VARCHAR(50) NOT NULL COMMENT '角色: FARMER, BUYER, BANK, EXPERT, ADMIN',
    avatar VARCHAR(255) COMMENT '头像',
    company VARCHAR(100) COMMENT '公司名称',
    location VARCHAR(200) COMMENT '位置',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    login_attempts INT DEFAULT 0 COMMENT '登录失败次数',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户表';

-- 创建验证码表
CREATE TABLE IF NOT EXISTS verification_codes (
    id VARCHAR(36) PRIMARY KEY COMMENT '验证码ID',
    phone VARCHAR(20) NOT NULL COMMENT '手机号',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    code VARCHAR(6) NOT NULL COMMENT '验证码',
    type VARCHAR(50) NOT NULL COMMENT '类型: REGISTER, LOGIN, RESET',
    expired_at DATETIME NOT NULL COMMENT '过期时间',
    attempts INT DEFAULT 0 COMMENT '尝试次数',
    used BOOLEAN DEFAULT FALSE COMMENT '是否已使用',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_phone_type (phone, type),
    INDEX idx_email_type (email, type),
    INDEX idx_expired_at (expired_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='验证码表';

-- 创建农户商品表
CREATE TABLE IF NOT EXISTS farmer_products (
    id VARCHAR(36) PRIMARY KEY COMMENT '商品ID',
    farmer_id VARCHAR(100) NOT NULL COMMENT '农户ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    category VARCHAR(100) NOT NULL COMMENT '商品类别',
    price DOUBLE NOT NULL COMMENT '价格',
    stock INT NOT NULL COMMENT '库存',
    origin VARCHAR(200) NOT NULL COMMENT '产地',
    description TEXT COMMENT '商品描述',
    status VARCHAR(20) NOT NULL DEFAULT 'OFF' COMMENT '状态: ON-已上架, OFF-已下架',
    view_count INT NOT NULL DEFAULT 0 COMMENT '浏览量',
    favorite_count INT NOT NULL DEFAULT 0 COMMENT '收藏数',
    share_count INT NOT NULL DEFAULT 0 COMMENT '分享数',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    INDEX idx_name (name),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='农户商品表';

-- 创建索引
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_verification_codes_created_at ON verification_codes(created_at);
CREATE INDEX idx_verification_codes_email ON verification_codes(email);

-- ============================================
-- 贷款功能相关表
-- ============================================

-- 创建贷款产品表
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

-- 创建融资申请表
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

-- 创建融资时间线表
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

-- 创建还款计划表
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

-- 创建还款记录表
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

-- 创建电子合同表
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

-- 创建智能拼单表
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

-- 创建拼单成员表
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

-- 创建信用评分记录表
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

-- 创建放款记录表
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

-- 创建对账记录表
CREATE TABLE IF NOT EXISTS reconciliation_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '对账记录ID',
    financing_id VARCHAR(36) NOT NULL COMMENT '融资申请ID',
    reconciliation_date DATE NOT NULL COMMENT '对账日期',
    disbursed_amount DECIMAL(15,2) NOT NULL COMMENT '放款金额（元）',
    repaid_principal DECIMAL(15,2) NOT NULL COMMENT '已还本金（元）',
    repaid_interest DECIMAL(15,2) NOT NULL COMMENT '已还利息（元）',
    pending_principal DECIMAL(15,2) NOT NULL COMMENT '待还本金（元）',
    pending_interest DECIMAL(15,2) NOT NULL COMMENT '待还利息（元）',
    overdue_principal DECIMAL(15,2) DEFAULT 0 COMMENT '逾期本金（元）',
    overdue_interest DECIMAL(15,2) DEFAULT 0 COMMENT '逾期利息（元）',
    overdue_penalty DECIMAL(15,2) DEFAULT 0 COMMENT '逾期罚息（元）',
    status VARCHAR(20) NOT NULL DEFAULT 'NORMAL' COMMENT '状态: NORMAL-正常, DIFFERENCE-有差异, RESOLVED-已处理',
    difference_amount DECIMAL(15,2) COMMENT '差异金额（元）',
    difference_reason TEXT COMMENT '差异原因',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_financing_id (financing_id),
    INDEX idx_reconciliation_date (reconciliation_date),
    INDEX idx_status (status),
    FOREIGN KEY (financing_id) REFERENCES financing_applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账记录表';

-- 创建银行客户关系表
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

-- 创建客户联系记录表
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

-- 创建申请资料表
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

-- 创建银行信息表
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

-- 创建银行账户表
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

-- 创建风险指标记录表
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

-- 创建银行系统配置表
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

-- ==================== 管理员模块表 ====================

-- 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_operation_logs (
    id VARCHAR(36) PRIMARY KEY COMMENT '日志ID',
    operator_id VARCHAR(36) NOT NULL COMMENT '操作人ID',
    operator_name VARCHAR(100) COMMENT '操作人姓名',
    operator_role VARCHAR(20) COMMENT '操作人角色',
    action_type VARCHAR(50) NOT NULL COMMENT '操作类型: PRODUCT_AUDIT-商品审核, CONTENT_AUDIT-内容审核, EXPERT_AUDIT-专家审核, USER_MANAGE-用户管理, PERMISSION_MANAGE-权限管理, SYSTEM_CONFIG-系统配置, BANNER_MANAGE-轮播图管理, COUPON_MANAGE-优惠券管理, GRAY_RELEASE-灰度发布',
    action_detail VARCHAR(500) COMMENT '操作详情',
    target_type VARCHAR(50) COMMENT '目标类型: PRODUCT-商品, CONTENT-内容, EXPERT-专家, USER-用户, CONFIG-配置, BANNER-轮播图, COUPON-优惠券, FEATURE-功能',
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

-- 创建管理员系统配置表
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员系统配置表';

-- 创建轮播图表
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

-- 创建优惠券表
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

-- 创建灰度发布表
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

-- 创建商品审核记录表
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

-- 创建内容审核记录表
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

-- 创建专家审核记录表
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

-- ==================== 订单和退款相关表 ====================

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单ID',
    buyer_id VARCHAR(36) NOT NULL COMMENT '买家ID',
    farmer_id VARCHAR(36) NOT NULL COMMENT '农户ID',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '订单总额',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '订单状态: PENDING-待支付, PAID-已支付, SHIPPED-已发货, COMPLETED-已完成, CANCELLED-已取消, REFUNDING-退款中, REFUNDED-已退款',
    shipping_address VARCHAR(500) COMMENT '收货地址',
    shipping_phone VARCHAR(20) COMMENT '收货电话',
    shipping_name VARCHAR(100) COMMENT '收货人姓名',
    payment_method VARCHAR(50) COMMENT '支付方式',
    refund_status VARCHAR(20) COMMENT '退款状态: PENDING-待处理, APPROVED-已同意, REJECTED-已拒绝, ESCALATED-已升级仲裁, SUCCESS-退款成功, FAILED-退款失败',
    refund_reason TEXT COMMENT '退款原因',
    tracking_number VARCHAR(100) COMMENT '物流单号',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (farmer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单项ID',
    order_id VARCHAR(36) NOT NULL COMMENT '订单ID',
    product_id VARCHAR(36) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(500) COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL COMMENT '数量',
    subtotal DECIMAL(15,2) NOT NULL COMMENT '小计',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES farmer_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单项表';

-- 创建退款历史记录表
CREATE TABLE IF NOT EXISTS refund_histories (
    id VARCHAR(36) PRIMARY KEY COMMENT '历史记录ID',
    order_id VARCHAR(36) NOT NULL COMMENT '订单ID',
    action VARCHAR(50) NOT NULL COMMENT '操作',
    actor VARCHAR(20) NOT NULL COMMENT '操作者: BUYER-买家, FARMER-农户, ADMIN-管理员',
    note TEXT COMMENT '备注',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_order_id (order_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='退款历史记录表';

-- ==================== 权限管理表 ====================

-- 创建权限表
CREATE TABLE IF NOT EXISTS admin_permissions (
    id VARCHAR(36) PRIMARY KEY COMMENT '权限ID',
    role VARCHAR(50) NOT NULL COMMENT '角色: FARMER, BUYER, BANK, EXPERT, ADMIN',
    resource VARCHAR(100) NOT NULL COMMENT '资源标识',
    action VARCHAR(50) NOT NULL COMMENT '操作: READ-读取, WRITE-写入, DELETE-删除, EXECUTE-执行',
    description VARCHAR(500) COMMENT '权限描述',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_role (role),
    INDEX idx_resource (resource),
    UNIQUE KEY uk_role_resource_action (role, resource, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- ==================== 专家模块表 ====================

-- 创建专家信息表
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

-- 创建问答表
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

-- 创建答案表
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

-- 创建预约时段表
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

-- 创建预约记录表
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

-- 创建专家内容表
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

-- 创建专家收入记录表
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

-- 创建专家提现记录表
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

-- 创建农户评价表
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

-- ==================== 买家模块表 ====================

-- 创建买家订单表
CREATE TABLE IF NOT EXISTS buyer_orders (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单ID',
    buyer_id VARCHAR(36) NOT NULL COMMENT '买家ID',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '订单状态',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '订单总额',
    shipping_name VARCHAR(100) COMMENT '收货人姓名',
    shipping_phone VARCHAR(20) COMMENT '收货电话',
    shipping_address VARCHAR(500) COMMENT '收货地址',
    payment_method VARCHAR(50) COMMENT '支付方式',
    refund_status VARCHAR(20) COMMENT '退款状态',
    refund_reason TEXT COMMENT '退款原因',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_buyer_orders_buyer (buyer_id),
    INDEX idx_buyer_orders_status (status),
    INDEX idx_buyer_orders_created_at (created_at),
    INDEX idx_buyer_orders_refund_status (refund_status),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='买家订单表';

-- 创建买家订单项表
CREATE TABLE IF NOT EXISTS buyer_order_items (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单项ID',
    order_id VARCHAR(36) NOT NULL COMMENT '订单ID',
    product_id VARCHAR(36) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(500) COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL COMMENT '数量',
    INDEX idx_buyer_order_items_order_id (order_id),
    INDEX idx_buyer_order_items_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES buyer_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES farmer_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='买家订单项表';

-- 创建买家购物车表
CREATE TABLE IF NOT EXISTS buyer_cart_items (
    id VARCHAR(36) PRIMARY KEY COMMENT '购物车项ID',
    buyer_id VARCHAR(36) NOT NULL COMMENT '买家ID',
    product_id VARCHAR(36) NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    selected TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否选中',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    UNIQUE KEY uk_buyer_product (buyer_id, product_id),
    INDEX idx_buyer_cart_buyer (buyer_id),
    INDEX idx_buyer_cart_product (product_id),
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES farmer_products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='买家购物车表';

-- 创建买家收货地址表
CREATE TABLE IF NOT EXISTS buyer_addresses (
    id VARCHAR(36) PRIMARY KEY COMMENT '地址ID',
    buyer_id VARCHAR(36) NOT NULL COMMENT '买家ID',
    name VARCHAR(100) NOT NULL COMMENT '收货人姓名',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    province VARCHAR(200) NOT NULL COMMENT '省份',
    city VARCHAR(200) NOT NULL COMMENT '城市',
    district VARCHAR(200) NOT NULL COMMENT '区县',
    detail VARCHAR(500) NOT NULL COMMENT '详细地址',
    postal_code VARCHAR(10) COMMENT '邮编',
    is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认地址',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_buyer_addresses_buyer (buyer_id),
    INDEX idx_buyer_addresses_default (is_default),
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='买家收货地址表';
