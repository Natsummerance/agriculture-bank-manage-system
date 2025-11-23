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
