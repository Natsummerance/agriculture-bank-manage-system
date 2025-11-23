# Three.js 多实例问题修复指南

## ✅ 已实施的修复

### 1. 创建 Three.js 单例 (`/utils/three-singleton.ts`)
```typescript
// 确保整个应用只有一个 Three.js 实例
import THREE from '../utils/three-singleton';
```

### 2. 更新 Vite 配置 (`/vite.config.ts`)
```typescript
resolve: {
  alias: {
    'three': path.resolve(__dirname, './node_modules/three'),
  },
  dedupe: ['three', 'react', 'react-dom'],
}
```

### 3. 更新 LoginPlanet4.tsx
```typescript
// 旧代码
import * as THREE from "three";

// 新代码
import THREE from "../utils/three-singleton";
```

---

## 🔍 验证修复

### 步骤 1: 重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
# 删除缓存
rm -rf node_modules/.vite

# 重启
npm run dev
```

### 步骤 2: 检查控制台
打开浏览器控制台，应该看不到以下警告：
```
WARNING: Multiple instances of Three.js being imported.
```

### 步骤 3: 验证单例
在浏览器控制台运行：
```javascript
console.log(window.__THREE_INSTANCE__);
// 应该输出 Three.js 对象，且只有一个
```

---

## 🐛 如果问题仍然存在

### 方案 A: 清除所有缓存
```bash
# 删除 node_modules
rm -rf node_modules

# 删除 package-lock.json
rm package-lock.json

# 重新安装
npm install

# 重启
npm run dev
```

### 方案 B: 检查依赖冲突
```bash
# 查看 Three.js 依赖树
npm ls three

# 应该只看到一个版本
# 如果看到多个版本，运行：
npm dedupe
```

### 方案 C: 强制使用单一版本
在 `package.json` 添加：
```json
{
  "overrides": {
    "three": "^0.170.0"
  }
}
```

---

## 📋 常见原因

1. **HMR (热模块替换)**: 开发时的快速刷新可能导致模块被多次加载
2. **多个 import 语句**: 不同文件使用不同方式导入
3. **依赖冲突**: 某些包内部也依赖 Three.js
4. **Vite 缓存**: `.vite` 文件夹缓存了旧版本

---

## ✅ 最佳实践

### 统一导入方式
```typescript
// ✅ 推荐 - 使用单例
import THREE from '../utils/three-singleton';

// ❌ 避免 - 直接导入
import * as THREE from 'three';
```

### 按需导入
```typescript
// ✅ 推荐 - 按需导入
import { Vector3, Mesh } from '../utils/three-singleton';

// ❌ 避免 - 全量导入
import * as THREE from 'three';
```

---

## 🎯 预期结果

修复后，应该看到：
- ✅ 控制台无 Three.js 警告
- ✅ 3D 星球渲染正常
- ✅ 性能稳定（60 FPS）
- ✅ 内存占用正常

---

## 📞 仍有问题？

如果以上方法都无效，检查：
1. Three.js 版本是否为最新稳定版
2. 是否有其他组件导入了 Three.js
3. Vite 配置是否正确加载

---

**修复版本**: v3.0.1  
**更新时间**: 2025-11-02  
**状态**: 🟢 已修复
