# 测试目录说明

本目录包含 AgriVerse 后端服务的测试相关文件。

## 目录结构

```
test/
├── scripts/              # 测试脚本
│   ├── test-api.sh      # Linux/Mac API测试脚本
│   ├── test-api.bat     # Windows API测试脚本
│   └── README.md        # 脚本使用说明
├── java/                 # Java测试类
│   └── com/agriverse/
│       └── ApiConnectivityTest.java  # API连通性测试
└── resources/            # 测试资源文件
    └── application-test.yml  # 测试环境配置
```

## 测试类型

### 1. 脚本测试（推荐用于快速验证）

位置: `test/scripts/`

- **用途**: 快速测试前后端API连通性
- **优点**: 无需编译，直接运行，适合CI/CD
- **适用场景**: 
  - 开发环境快速验证
  - 部署后健康检查
  - 集成测试

详细说明请参考 [scripts/README.md](scripts/README.md)

### 2. Java单元测试

位置: `test/java/`

- **用途**: 使用Spring Boot Test进行集成测试
- **优点**: 类型安全，IDE支持，可集成到Maven构建流程
- **适用场景**:
  - 单元测试
  - 集成测试
  - 自动化测试

## 运行测试

### 运行脚本测试

**Linux/Mac:**
```bash
cd backend/src/test/scripts
chmod +x test-api.sh
./test-api.sh
```

**Windows:**
```cmd
cd backend\src\test\scripts
test-api.bat
```

### 运行Java测试

```bash
# 在backend目录下运行
mvn test

# 或运行特定测试类
mvn test -Dtest=ApiConnectivityTest
```

## 测试覆盖

当前测试覆盖以下功能：

1. ✅ 健康检查接口
2. ✅ 用户注册接口
3. ✅ 用户登录接口
4. ✅ JWT Token认证
5. ✅ 农户商品管理接口
6. ✅ 安全验证（未认证访问）

## 注意事项

1. **测试环境**: Java测试使用H2内存数据库，不会影响生产数据
2. **测试数据**: 脚本测试会创建临时测试用户
3. **端口冲突**: 确保测试端口未被占用
4. **依赖服务**: 某些测试需要后端服务已启动

## 扩展测试

如需添加新的测试：

1. **脚本测试**: 在 `scripts/` 目录添加新的测试函数
2. **Java测试**: 在 `java/` 目录创建新的测试类
3. **测试数据**: 在 `resources/` 目录添加测试数据文件

## 相关文档

- [后端README](../../README.md) - 完整的后端文档
- [脚本测试说明](scripts/README.md) - 脚本测试详细说明

