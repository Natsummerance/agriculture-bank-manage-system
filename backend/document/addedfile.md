# 新增和修改文件记录

> **说明**: 本文档记录项目开发过程中所有新增和修改的文件，便于追踪和管理。

---

## 文件记录格式

```
### [日期] - [模块名称] - [操作类型]

**新增文件**:
- `文件路径` - 文件说明

**修改文件**:
- `文件路径` - 修改说明
```

---

## 记录列表

### 2025-01-XX - 银行模块 - 文档撰写和实现

**新增文件**:
- `backend/document/bank.md` - 银行模块贷款功能后端实现流程文档，包含数据库设计、实体类、DTO、Repository、Service、Controller层设计，以及业务流程说明、API接口设计和实现步骤
- `backend/document/bank-other.md` - 银行其他功能后端实现流程文档，包含仪表盘、客户管理、风控管理、申请资料管理、银行信息管理等功能的完整实现规划
- `backend/document/BANK_OTHER_IMPLEMENTATION_SUMMARY.md` - 银行其他功能实现完成总结文档

**修改文件**:
- `backend/init.sql` - 添加了7张新表：bank_customer_relations, customer_contact_records, application_documents, bank_info, bank_accounts, risk_indicators, bank_system_config

### 2025-01-XX - 银行模块 - 实体类实现

**新增文件**:
- `backend/src/main/java/com/agriverse/bank/entity/BankCustomerRelation.java` - 银行客户关系实体类
- `backend/src/main/java/com/agriverse/bank/entity/CustomerContactRecord.java` - 客户联系记录实体类
- `backend/src/main/java/com/agriverse/bank/entity/ApplicationDocument.java` - 申请资料实体类
- `backend/src/main/java/com/agriverse/bank/entity/BankInfo.java` - 银行信息实体类
- `backend/src/main/java/com/agriverse/bank/entity/BankAccount.java` - 银行账户实体类
- `backend/src/main/java/com/agriverse/bank/entity/RiskIndicator.java` - 风险指标实体类
- `backend/src/main/java/com/agriverse/bank/entity/BankSystemConfig.java` - 银行系统配置实体类

### 2025-01-XX - 银行模块 - DTO实现

**新增文件**:
- `backend/src/main/java/com/agriverse/bank/dto/DashboardStatisticsResponse.java` - 仪表盘统计响应DTO
- `backend/src/main/java/com/agriverse/bank/dto/TrendData.java` - 趋势数据DTO
- `backend/src/main/java/com/agriverse/bank/dto/CustomerSearchRequest.java` - 客户搜索请求DTO
- `backend/src/main/java/com/agriverse/bank/dto/CustomerDetailResponse.java` - 客户详情响应DTO
- `backend/src/main/java/com/agriverse/bank/dto/CustomerContactRequest.java` - 客户联系请求DTO
- `backend/src/main/java/com/agriverse/bank/dto/RiskDashboardResponse.java` - 风控仪表盘响应DTO
- `backend/src/main/java/com/agriverse/bank/dto/RiskAlert.java` - 风险预警DTO
- `backend/src/main/java/com/agriverse/bank/dto/DocumentUploadRequest.java` - 资料上传请求DTO
- `backend/src/main/java/com/agriverse/bank/dto/DocumentVerifyRequest.java` - 资料审核请求DTO
- `backend/src/main/java/com/agriverse/bank/dto/BankInfoRequest.java` - 银行信息请求DTO
- `backend/src/main/java/com/agriverse/bank/dto/BankAccountRequest.java` - 银行账户请求DTO

### 2025-01-XX - 银行模块 - Repository实现

**新增文件**:
- `backend/src/main/java/com/agriverse/bank/repository/BankCustomerRelationRepository.java` - 银行客户关系Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/CustomerContactRecordRepository.java` - 客户联系记录Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/ApplicationDocumentRepository.java` - 申请资料Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/BankInfoRepository.java` - 银行信息Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/BankAccountRepository.java` - 银行账户Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/RiskIndicatorRepository.java` - 风险指标Repository接口
- `backend/src/main/java/com/agriverse/bank/repository/BankSystemConfigRepository.java` - 银行系统配置Repository接口

**修改文件**:
- `backend/src/main/java/com/agriverse/finance/repository/DisbursementRepository.java` - 添加了findByStatusAndDisbursedAtBetween方法
- `backend/src/main/java/com/agriverse/finance/repository/FinancingApplicationRepository.java` - 添加了countByStatus方法

### 2025-01-XX - 银行模块 - Service实现

**新增文件**:
- `backend/src/main/java/com/agriverse/bank/service/BankDashboardService.java` - 银行仪表盘服务类
- `backend/src/main/java/com/agriverse/bank/service/BankCustomerService.java` - 银行客户服务类
- `backend/src/main/java/com/agriverse/bank/service/RiskManagementService.java` - 风险管理服务类
- `backend/src/main/java/com/agriverse/bank/service/ApplicationDocumentService.java` - 申请资料服务类
- `backend/src/main/java/com/agriverse/bank/service/BankInfoService.java` - 银行信息服务类
- `backend/src/main/java/com/agriverse/bank/service/BankSystemConfigService.java` - 银行系统配置服务类

### 2025-01-XX - 银行模块 - Controller实现

**新增文件**:
- `backend/src/main/java/com/agriverse/bank/controller/BankDashboardController.java` - 银行仪表盘控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/bank/controller/BankCustomerController.java` - 银行客户管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/bank/controller/BankRiskController.java` - 银行风控管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/bank/controller/BankDocumentController.java` - 申请资料管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/bank/controller/BankInfoController.java` - 银行信息管理控制器，包含Swagger注解

### 2025-01-XX - 管理员模块 - 文档撰写

**新增文件**:
- `backend/document/admin.md` - 管理员模块后端实现流程文档，包含数据库设计、实体类、DTO、Repository、Service、Controller层设计，以及业务流程说明、API接口设计和实现步骤

**修改文件**:
- `backend/init.sql` - 添加了8张新表：admin_operation_logs, admin_system_config, admin_banners, admin_coupons, admin_gray_releases, admin_product_audits, admin_content_audits, admin_expert_audits

### 2025-01-XX - 管理员模块 - 实体类实现

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/entity/AdminOperationLog.java` - 管理员操作日志实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminSystemConfig.java` - 管理员系统配置实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminBanner.java` - 轮播图实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminCoupon.java` - 优惠券实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminGrayRelease.java` - 灰度发布实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminProductAudit.java` - 商品审核记录实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminContentAudit.java` - 内容审核记录实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminExpertAudit.java` - 专家审核记录实体类

### 2025-01-XX - 管理员模块 - DTO实现（规划）

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/dto/AdminDashboardStatisticsResponse.java` - 管理员仪表盘统计响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/TrendData.java` - 趋势数据DTO（管理员模块）
- `backend/src/main/java/com/agriverse/admin/dto/FinanceMonitorResponse.java` - 融资监控响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/ProductAuditRequest.java` - 商品审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/ContentAuditRequest.java` - 内容审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/ExpertAuditRequest.java` - 专家审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/UserSearchRequest.java` - 用户搜索请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/UserStatusUpdateRequest.java` - 用户状态更新请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/SystemConfigRequest.java` - 系统配置请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/OperationLogSearchRequest.java` - 操作日志搜索请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/BannerRequest.java` - 轮播图请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/CouponRequest.java` - 优惠券请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/GrayReleaseRequest.java` - 灰度发布请求DTO

### 2025-01-XX - 管理员模块 - Repository实现（规划）

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/repository/AdminOperationLogRepository.java` - 管理员操作日志Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminSystemConfigRepository.java` - 管理员系统配置Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminBannerRepository.java` - 轮播图Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminCouponRepository.java` - 优惠券Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminGrayReleaseRepository.java` - 灰度发布Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminProductAuditRepository.java` - 商品审核记录Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminContentAuditRepository.java` - 内容审核记录Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminExpertAuditRepository.java` - 专家审核记录Repository接口

### 2025-01-XX - 管理员模块 - Service实现（规划）

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/service/AdminDashboardService.java` - 管理员仪表盘服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminFinanceMonitorService.java` - 融资监控服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminAuditService.java` - 审核服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminUserService.java` - 用户管理服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminSystemConfigService.java` - 系统配置服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminOperationLogService.java` - 操作日志服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminBannerService.java` - 轮播图服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminCouponService.java` - 优惠券服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminGrayReleaseService.java` - 灰度发布服务类

### 2025-01-XX - 管理员模块 - Controller实现（规划）

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/controller/AdminDashboardController.java` - 管理员仪表盘控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminFinanceMonitorController.java` - 融资监控控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminAuditController.java` - 审核管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminUserController.java` - 用户管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminSystemConfigController.java` - 系统配置控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminOperationLogController.java` - 操作日志控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminBannerController.java` - 轮播图管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminCouponController.java` - 优惠券管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminGrayReleaseController.java` - 灰度发布控制器，包含Swagger注解

### 2025-01-XX - 文件记录文档

**新增文件**:
- `backend/document/addedfile.md` - 新增和修改文件记录文档（本文件）

---

## 文件分类索引

### 文档文件（5个）
- `backend/document/bank.md` - 银行模块贷款功能后端实现流程文档
- `backend/document/bank-other.md` - 银行其他功能后端实现流程文档
- `backend/document/admin.md` - 管理员模块后端实现流程文档
- `backend/document/BANK_OTHER_IMPLEMENTATION_SUMMARY.md` - 银行其他功能实现完成总结文档
- `backend/document/addedfile.md` - 新增和修改文件记录文档（本文件）

### 数据库文件（1个修改）
- `backend/init.sql` - 数据库初始化脚本（添加了7张新表）

### 银行模块 - 实体类（7个）
- `backend/src/main/java/com/agriverse/bank/entity/BankCustomerRelation.java`
- `backend/src/main/java/com/agriverse/bank/entity/CustomerContactRecord.java`
- `backend/src/main/java/com/agriverse/bank/entity/ApplicationDocument.java`
- `backend/src/main/java/com/agriverse/bank/entity/BankInfo.java`
- `backend/src/main/java/com/agriverse/bank/entity/BankAccount.java`
- `backend/src/main/java/com/agriverse/bank/entity/RiskIndicator.java`
- `backend/src/main/java/com/agriverse/bank/entity/BankSystemConfig.java`

### 银行模块 - DTO（11个）
- `backend/src/main/java/com/agriverse/bank/dto/DashboardStatisticsResponse.java`
- `backend/src/main/java/com/agriverse/bank/dto/TrendData.java`
- `backend/src/main/java/com/agriverse/bank/dto/CustomerSearchRequest.java`
- `backend/src/main/java/com/agriverse/bank/dto/CustomerDetailResponse.java`
- `backend/src/main/java/com/agriverse/bank/dto/CustomerContactRequest.java`
- `backend/src/main/java/com/agriverse/bank/dto/RiskDashboardResponse.java`
- `backend/src/main/java/com/agriverse/bank/dto/RiskAlert.java`
- `backend/src/main/java/com/agriverse/bank/dto/DocumentUploadRequest.java`
- `backend/src/main/java/com/agriverse/bank/dto/DocumentVerifyRequest.java`
- `backend/src/main/java/com/agriverse/bank/dto/BankInfoRequest.java`
- `backend/src/main/java/com/agriverse/bank/dto/BankAccountRequest.java`

### 银行模块 - Repository（7个新增 + 2个修改）
- `backend/src/main/java/com/agriverse/bank/repository/BankCustomerRelationRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/CustomerContactRecordRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/ApplicationDocumentRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/BankInfoRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/BankAccountRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/RiskIndicatorRepository.java`
- `backend/src/main/java/com/agriverse/bank/repository/BankSystemConfigRepository.java`
- `backend/src/main/java/com/agriverse/finance/repository/DisbursementRepository.java` (修改)
- `backend/src/main/java/com/agriverse/finance/repository/FinancingApplicationRepository.java` (修改)

### 银行模块 - Service（6个）
- `backend/src/main/java/com/agriverse/bank/service/BankDashboardService.java`
- `backend/src/main/java/com/agriverse/bank/service/BankCustomerService.java`
- `backend/src/main/java/com/agriverse/bank/service/RiskManagementService.java`
- `backend/src/main/java/com/agriverse/bank/service/ApplicationDocumentService.java`
- `backend/src/main/java/com/agriverse/bank/service/BankInfoService.java`
- `backend/src/main/java/com/agriverse/bank/service/BankSystemConfigService.java`

### 银行模块 - Controller（5个）
- `backend/src/main/java/com/agriverse/bank/controller/BankDashboardController.java`
- `backend/src/main/java/com/agriverse/bank/controller/BankCustomerController.java`
- `backend/src/main/java/com/agriverse/bank/controller/BankRiskController.java`
- `backend/src/main/java/com/agriverse/bank/controller/BankDocumentController.java`
- `backend/src/main/java/com/agriverse/bank/controller/BankInfoController.java`

### 管理员模块 - 实体类（8个）
- `backend/src/main/java/com/agriverse/admin/entity/AdminOperationLog.java` - 操作日志实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminSystemConfig.java` - 系统配置实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminBanner.java` - 轮播图实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminCoupon.java` - 优惠券实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminGrayRelease.java` - 灰度发布实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminProductAudit.java` - 商品审核记录实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminContentAudit.java` - 内容审核记录实体类
- `backend/src/main/java/com/agriverse/admin/entity/AdminExpertAudit.java` - 专家审核记录实体类

### 管理员模块 - DTO（12个，TrendData复用bank模块）
- `backend/src/main/java/com/agriverse/admin/dto/AdminDashboardStatisticsResponse.java` - 仪表盘统计响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/FinanceMonitorResponse.java` - 融资监控响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/ProductAuditRequest.java` - 商品审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/ContentAuditRequest.java` - 内容审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/ExpertAuditRequest.java` - 专家审核请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/UserSearchRequest.java` - 用户搜索请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/UserStatusUpdateRequest.java` - 用户状态更新请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/SystemConfigRequest.java` - 系统配置请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/OperationLogSearchRequest.java` - 操作日志搜索请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/BannerRequest.java` - 轮播图请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/CouponRequest.java` - 优惠券请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/GrayReleaseRequest.java` - 灰度发布请求DTO

### 管理员模块 - Repository（8个）
- `backend/src/main/java/com/agriverse/admin/repository/AdminOperationLogRepository.java` - 操作日志Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminSystemConfigRepository.java` - 系统配置Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminBannerRepository.java` - 轮播图Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminCouponRepository.java` - 优惠券Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminGrayReleaseRepository.java` - 灰度发布Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminProductAuditRepository.java` - 商品审核Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminContentAuditRepository.java` - 内容审核Repository接口
- `backend/src/main/java/com/agriverse/admin/repository/AdminExpertAuditRepository.java` - 专家审核Repository接口

**修改文件**:
- `backend/src/main/java/com/agriverse/auth/repository/UserRepository.java` - 添加JpaSpecificationExecutor支持，用于动态查询

### 管理员模块 - Service（9个）
- `backend/src/main/java/com/agriverse/admin/service/AdminDashboardService.java` - 管理员仪表盘服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminFinanceMonitorService.java` - 融资监控服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminAuditService.java` - 审核服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminUserService.java` - 用户管理服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminSystemConfigService.java` - 系统配置服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminOperationLogService.java` - 操作日志服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminBannerService.java` - 轮播图服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminCouponService.java` - 优惠券服务类
- `backend/src/main/java/com/agriverse/admin/service/AdminGrayReleaseService.java` - 灰度发布服务类

### 管理员模块 - Controller（9个，集成Swagger）
- `backend/src/main/java/com/agriverse/admin/controller/AdminDashboardController.java` - 管理员仪表盘控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminFinanceMonitorController.java` - 融资监控控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminAuditController.java` - 审核管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminUserController.java` - 用户管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminSystemConfigController.java` - 系统配置控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminOperationLogController.java` - 操作日志控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminBannerController.java` - 轮播图管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminCouponController.java` - 优惠券管理控制器，包含Swagger注解
- `backend/src/main/java/com/agriverse/admin/controller/AdminGrayReleaseController.java` - 灰度发布控制器，包含Swagger注解

---

## 统计信息

### 总计
- **文档文件**: 5个
- **数据库文件**: 1个（修改，添加了15张新表）
- **银行模块文件**: 37个（35个新增 + 2个修改）
- **管理员模块文件**: 47个（已实现）
- **总计**: 90个文件

### 按类型统计
- **实体类（Entity）**: 15个（银行7个 + 管理员8个）
- **DTO**: 24个（银行11个 + 管理员12个 + TrendData复用1个）
- **Repository**: 18个（银行7个新增 + 管理员8个新增 + 3个修改）
- **Service**: 15个（银行6个 + 管理员9个）
- **Controller**: 14个（银行5个 + 管理员9个）
- **文档**: 5个

---

## 使用说明

1. **新增文件时**: 在"记录列表"中添加新的记录项，包含日期、模块名称、操作类型和文件路径
2. **修改文件时**: 在对应记录项中添加"修改文件"部分，说明修改内容
3. **文件分类**: 按照文件类型（文档、代码、配置等）进行分类索引
4. **定期更新**: 每次创建或修改文件后，及时更新本文档
5. **标记说明**: 
   - 已实现的文件：直接列出
   - 规划中的文件：标注"（规划）"
   - 修改的文件：标注"（修改）"

---

**最后更新**: 2025-01-XX  
**总文件数**: 90个（已全部实现）

### 管理员模块实现完成说明

**实现状态**: ✅ 已完成

**实现内容**:
1. ✅ 数据库表：8张新表已添加到init.sql
2. ✅ 实体类：8个实体类已创建
3. ✅ DTO类：12个DTO类已创建（TrendData复用bank模块）
4. ✅ Repository：8个Repository接口已创建
5. ✅ Service：9个Service类已创建
6. ✅ Controller：9个Controller类已创建，全部集成Swagger注解
7. ✅ 权限配置：UserRepository已添加JpaSpecificationExecutor支持
8. ✅ 安全配置：JwtAuthenticationFilter已更新，支持角色权限验证

**注意事项**:
- Order相关功能标记为TODO，需要后续实现Order实体和Repository
- PV/UV统计功能标记为TODO，需要访问日志表支持
- Excel导出功能标记为TODO，需要POI或EasyExcel库
- 灰度发布用户匹配逻辑已实现（基于用户ID哈希和目标用户类型）

### 2025-01-XX - 修复和完善

**修改文件**:
- `backend/src/main/java/com/agriverse/config/JwtAuthenticationFilter.java` - 修复缺失的导入（List, GrantedAuthority, ArrayList, SimpleGrantedAuthority）
- `backend/src/main/java/com/agriverse/admin/service/AdminAuditService.java` - 实现专家审核通过后更新用户角色为EXPERT的功能
- `backend/src/main/java/com/agriverse/admin/service/AdminGrayReleaseService.java` - 实现灰度发布用户匹配逻辑（基于用户ID哈希、发布比例和目标用户类型）

### 2025-01-XX - 管理员模块 - 用户管理功能补充

**新增文件**:
- `backend/src/main/java/com/agriverse/admin/dto/UserRoleUpdateRequest.java` - 用户角色更新请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/UserStatisticsResponse.java` - 用户统计响应DTO

**修改文件**:
- `backend/src/main/java/com/agriverse/admin/service/AdminUserService.java` - 添加用户详情查看、角色修改和用户统计功能
- `backend/src/main/java/com/agriverse/admin/controller/AdminUserController.java` - 添加用户详情、角色修改和统计接口

### 2025-01-XX - 管理员模块 - 订单监控、退款仲裁、权限管理功能

**新增实体类**:
- `backend/src/main/java/com/agriverse/entity/Order.java` - 订单实体
- `backend/src/main/java/com/agriverse/entity/OrderItem.java` - 订单项实体
- `backend/src/main/java/com/agriverse/entity/RefundHistory.java` - 退款历史记录实体
- `backend/src/main/java/com/agriverse/admin/entity/AdminPermission.java` - 权限实体

**新增Repository**:
- `backend/src/main/java/com/agriverse/order/repository/OrderRepository.java` - 订单Repository
- `backend/src/main/java/com/agriverse/order/repository/OrderItemRepository.java` - 订单项Repository
- `backend/src/main/java/com/agriverse/order/repository/RefundHistoryRepository.java` - 退款历史Repository
- `backend/src/main/java/com/agriverse/admin/repository/AdminPermissionRepository.java` - 权限Repository

**新增DTO**:
- `backend/src/main/java/com/agriverse/admin/dto/OrderSearchRequest.java` - 订单搜索请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/OrderStatisticsResponse.java` - 订单统计响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/RefundArbitrationRequest.java` - 退款仲裁请求DTO
- `backend/src/main/java/com/agriverse/admin/dto/RefundDisputeResponse.java` - 退款纠纷响应DTO
- `backend/src/main/java/com/agriverse/admin/dto/PermissionRequest.java` - 权限请求DTO

**新增Service**:
- `backend/src/main/java/com/agriverse/admin/service/AdminOrderService.java` - 订单监控服务
- `backend/src/main/java/com/agriverse/admin/service/AdminRefundService.java` - 退款仲裁服务
- `backend/src/main/java/com/agriverse/admin/service/AdminPermissionService.java` - 权限管理服务

**新增Controller**:
- `backend/src/main/java/com/agriverse/admin/controller/AdminOrderController.java` - 订单监控控制器
- `backend/src/main/java/com/agriverse/admin/controller/AdminRefundController.java` - 退款仲裁控制器
- `backend/src/main/java/com/agriverse/admin/controller/AdminPermissionController.java` - 权限管理控制器

**修改文件**:
- `backend/init.sql` - 添加订单表、订单项表、退款历史表、权限表
- `backend/src/main/java/com/agriverse/admin/service/AdminDashboardService.java` - 更新以使用OrderRepository实现订单统计和趋势分析

---

## 专家模块文件列表

### 数据库文件
- **backend/init.sql** (修改)
  - 添加了9个专家模块相关的数据库表定义

### 实体类 (Entity) - 9个
- **backend/src/main/java/com/agriverse/expert/entity/ExpertProfile.java** (新建)
  - 专家信息实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertQuestion.java** (新建)
  - 问答实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertAnswer.java** (新建)
  - 答案实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertAvailableSlot.java** (新建)
  - 预约时段实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertAppointment.java** (新建)
  - 预约记录实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertContent.java** (新建)
  - 专家内容实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertIncomeRecord.java** (新建)
  - 专家收入记录实体类
- **backend/src/main/java/com/agriverse/expert/entity/ExpertWithdrawal.java** (新建)
  - 专家提现记录实体类
- **backend/src/main/java/com/agriverse/expert/entity/FarmerReview.java** (新建)
  - 农户评价实体类

### Repository层 - 9个
- **backend/src/main/java/com/agriverse/expert/repository/ExpertProfileRepository.java** (新建)
  - 专家信息数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertQuestionRepository.java** (新建)
  - 问答数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertAnswerRepository.java** (新建)
  - 答案数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertAvailableSlotRepository.java** (新建)
  - 预约时段数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertAppointmentRepository.java** (新建)
  - 预约记录数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertContentRepository.java** (新建)
  - 专家内容数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertIncomeRecordRepository.java** (新建)
  - 专家收入记录数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/ExpertWithdrawalRepository.java** (新建)
  - 专家提现记录数据访问接口
- **backend/src/main/java/com/agriverse/expert/repository/FarmerReviewRepository.java** (新建)
  - 农户评价数据访问接口

### DTO类 - 9个
- **backend/src/main/java/com/agriverse/expert/dto/ExpertDashboardStatisticsResponse.java** (新建)
  - 专家仪表盘统计响应DTO
- **backend/src/main/java/com/agriverse/expert/dto/QuestionSearchRequest.java** (新建)
  - 问题搜索请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/AnswerRequest.java** (新建)
  - 回答请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/AvailableSlotRequest.java** (新建)
  - 可用时段请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/AppointmentStatusUpdateRequest.java** (新建)
  - 预约状态更新请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/ContentPublishRequest.java** (新建)
  - 内容发布请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/WithdrawalRequest.java** (新建)
  - 提现请求DTO
- **backend/src/main/java/com/agriverse/expert/dto/IncomeStatisticsResponse.java** (新建)
  - 收入统计响应DTO
- **backend/src/main/java/com/agriverse/expert/dto/ServicePriceUpdateRequest.java** (新建)
  - 服务价格更新请求DTO

### Service层 - 6个
- **backend/src/main/java/com/agriverse/expert/service/ExpertDashboardService.java** (新建)
  - 专家仪表盘服务
- **backend/src/main/java/com/agriverse/expert/service/ExpertQAService.java** (新建)
  - 专家问答服务
- **backend/src/main/java/com/agriverse/expert/service/ExpertAppointmentService.java** (新建)
  - 专家预约服务
- **backend/src/main/java/com/agriverse/expert/service/ExpertContentService.java** (新建)
  - 专家内容服务
- **backend/src/main/java/com/agriverse/expert/service/ExpertIncomeService.java** (新建)
  - 专家收入服务
- **backend/src/main/java/com/agriverse/expert/service/ExpertProfileService.java** (新建)
  - 专家资料服务

### Controller层 - 6个
- **backend/src/main/java/com/agriverse/expert/controller/ExpertDashboardController.java** (新建)
  - 专家仪表盘控制器
- **backend/src/main/java/com/agriverse/expert/controller/ExpertQAController.java** (新建)
  - 专家问答管理控制器
- **backend/src/main/java/com/agriverse/expert/controller/ExpertAppointmentController.java** (新建)
  - 专家预约管理控制器
- **backend/src/main/java/com/agriverse/expert/controller/ExpertContentController.java** (新建)
  - 专家内容管理控制器
- **backend/src/main/java/com/agriverse/expert/controller/ExpertIncomeController.java** (新建)
  - 专家收入管理控制器
- **backend/src/main/java/com/agriverse/expert/controller/ExpertProfileController.java** (新建)
  - 专家资料管理控制器

### 文档文件
- **backend/document/expert.md** (新建)
  - 专家模块后端实现流程文档
