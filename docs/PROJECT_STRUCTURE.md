# AgriVerse 项目结构说明

## 📁 项目目录结构

```
agriculture-bank-manage-system-master/
├── frontend/                      # 前端项目（React + TypeScript）
│   ├── api/                       # API客户端代码
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── bank.ts
│   │   ├── buyer.ts
│   │   ├── expert.ts
│   │   ├── farmer.ts
│   │   └── types.ts
│   ├── apps/                      # 应用入口文件
│   │   ├── adminApp.tsx
│   │   ├── bankApp.tsx
│   │   ├── buyerApp.tsx
│   │   ├── expertApp.tsx
│   │   └── farmerApp.tsx
│   ├── components/                # React组件
│   │   ├── ui/                    # UI基础组件
│   │   ├── admin/                 # 管理员组件
│   │   ├── bank/                  # 银行组件
│   │   ├── buyer/                 # 买家组件
│   │   ├── expert/                # 专家组件
│   │   ├── farmer/                # 农户组件
│   │   └── ...
│   ├── config/                    # 配置文件
│   │   ├── permissions.ts
│   │   └── roleNavigation.ts
│   ├── contexts/                  # React Context
│   │   └── RoleContext.tsx
│   ├── hooks/                     # React Hooks
│   ├── pages/                     # 页面组件
│   ├── roles/                     # 角色相关页面
│   │   ├── admin/
│   │   ├── bank/
│   │   ├── buyer/
│   │   ├── expert/
│   │   └── farmer/
│   ├── router/                    # 路由配置
│   │   └── index.tsx
│   ├── stores/                    # Zustand状态管理
│   ├── styles/                    # 样式文件
│   ├── utils/                     # 工具函数
│   ├── tests/                     # 前端单元测试（Vitest）
│   ├── App.tsx                    # 应用根组件
│   ├── main.tsx                   # 入口文件
│   ├── index.html                 # HTML入口
│   ├── index.css                  # 全局样式
│   ├── package.json               # 前端依赖配置
│   ├── vite.config.ts             # Vite配置
│   ├── vitest.config.ts           # Vitest配置
│   ├── tsconfig.json              # TypeScript配置
│   └── tailwind.config.js         # Tailwind配置
│
├── backend/                       # 后端项目（Spring Boot）
│   ├── src/
│   │   ├── main/                  # 主代码
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/                  # 测试代码
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml                    # Maven配置
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── docs/                          # 项目文档和资源
│   ├── md/                        # Markdown文档
│   │   ├── architecture/          # 架构文档
│   │   ├── design/                # 设计文档
│   │   ├── features/              # 功能文档
│   │   ├── fixes/                 # 修复记录
│   │   ├── guides/                # 指南文档
│   │   │   ├── quick-start/       # 快速开始
│   │   │   ├── testing/           # 测试指南
│   │   │   ├── deployment/        # 部署指南
│   │   │   ├── development/       # 开发指南
│   │   │   └── technical/         # 技术文档
│   │   ├── implementation/        # 实现文档
│   │   ├── reports/               # 报告文档
│   │   └── verification/          # 验证文档
│   ├── presentations/             # PPT演示文稿
│   │   ├── AgriVerse_AppleStyle.pptx
│   │   └── AgriVerse_Ultimate.pptx
│   └── PROJECT_STRUCTURE.md       # 项目结构说明（本文件）
│
├── tests/                         # 测试目录
│   ├── e2e/                       # E2E测试（Playwright）
│   │   ├── tests/
│   │   ├── playwright.config.ts
│   │   └── package.json
│   ├── backend/                   # 后端测试文档和脚本
│   │   ├── scripts/
│   │   └── README.md
│   └── scripts/                   # 测试运行脚本
│       ├── run-tests.ps1
│       ├── run-e2e-tests.ps1
│       ├── test-connectivity.ps1
│       ├── test-connectivity.js
│       ├── test-connectivity.py
│       └── test-system.ps1
│
├── scripts/                       # 服务管理脚本
│   ├── start-all-services.ps1
│   └── README.md
│
├── tools/                         # 工具脚本
│   └── ppt-generator.py
│
└── README.md                      # 项目说明（根目录唯一文档）
```

## 📂 目录说明

### 前端项目 (frontend/)

- **api/**: API客户端代码，封装所有后端API调用
- **apps/**: 各角色应用的入口文件
- **components/**: React组件库，按功能分类
- **roles/**: 角色相关的页面组件
- **pages/**: 通用页面组件
- **stores/**: Zustand状态管理
- **hooks/**: 自定义React Hooks
- **utils/**: 工具函数
- **tests/**: 前端单元测试（Vitest）

### 后端项目 (backend/)

- **src/main/**: 主代码（Java）
- **src/test/**: 测试代码（JUnit 5）
- **pom.xml**: Maven依赖配置

### 文档目录 (docs/)

- **md/**: 所有项目文档，按类型分类
  - **architecture/**: 架构设计文档
  - **design/**: UI/UX设计文档
  - **features/**: 功能说明文档
  - **guides/**: 各种指南文档
    - **quick-start/**: 快速开始指南
    - **testing/**: 测试相关指南
    - **deployment/**: 部署指南
    - **development/**: 开发指南
    - **technical/**: 技术文档
  - **fixes/**: Bug修复记录
  - **reports/**: 项目报告
  - **verification/**: 验证文档
- **presentations/**: PPT演示文稿
- **PROJECT_STRUCTURE.md**: 项目结构说明（本文件）

### 测试目录 (tests/)

- **e2e/**: E2E端到端测试（Playwright）
- **backend/**: 后端测试文档和脚本
- **scripts/**: 测试运行脚本

### 脚本目录

- **scripts/**: 服务管理脚本
- **tools/**: 开发工具脚本

## 📋 文件命名规范

### 组件文件
- 使用PascalCase: `UserProfile.tsx`
- 页面组件: `HomePage.tsx`, `ProductList.tsx`
- 通用组件: `Button.tsx`, `Dialog.tsx`

### 工具文件
- 使用camelCase: `api.ts`, `uploadService.ts`
- Hook文件: `useRoleNav.ts`, `useFarmerFinance.ts`

### 配置文件
- 使用kebab-case: `vite.config.ts`, `tsconfig.json`

### 文档文件
- 使用UPPER_SNAKE_CASE: `TEST_PLAN.md`, `QUICK_START.md`
- 或使用PascalCase: `README.md`, `Guidelines.md`

## 🔄 文件整理规则

### 文档文件
- 所有`.md`文档放在`docs/md/`目录下，按类型分类
- 测试相关文档放在`docs/md/guides/testing/`
- 部署相关文档放在`docs/md/guides/deployment/`

### 脚本文件
- 所有脚本放在`scripts/`目录
- 工具脚本放在`tools/`目录

### 资源文件
- PPT文件放在`docs/presentations/`
- 图片资源放在`assets/`（如需要）

### 测试文件
- E2E测试放在`tests/e2e/`
- 前端单元测试放在`frontend/tests/`
- 后端测试代码放在`backend/src/test/`（Maven标准结构）
- 测试脚本和文档放在`tests/scripts/`和`tests/backend/`

## 📝 维护说明

1. **新增文档**: 根据类型放入`docs/md/`对应子目录
2. **新增脚本**: 放入`scripts/`目录
3. **新增工具**: 放入`tools/`目录
4. **新增组件**: 根据功能放入`frontend/components/`对应子目录
5. **新增页面**: 根据角色放入`frontend/roles/`对应目录

## 🚀 快速开始

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 运行测试
```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
mvn test

# E2E测试
cd tests/e2e
npm test
```

## 🔗 相关文档

- [README.md](../README.md) - 项目总览
- [docs/md/README.md](md/README.md) - 文档索引
- [scripts/README.md](../scripts/README.md) - 脚本说明
- [tests/e2e/README.md](../tests/e2e/README.md) - E2E测试说明

---

**最后更新**: 2025-01-XX  
**版本**: 2.0
