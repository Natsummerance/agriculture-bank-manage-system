# 🚀 StackBlitz 一键启动指南

## 方式1：在线打开 StackBlitz（最快）

### 步骤1：创建新项目
访问：https://stackblitz.com/

点击 **"New Project"** → 选择 **"Vite + React + TypeScript"**

### 步骤2：替换文件

#### 2.1 根目录配置文件

**📄 vite.config.ts** （替换）
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5173,
  },
})
```

**📄 index.html** （替换）
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>星云·AgriVerse</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**📄 package.json** （替换 dependencies 部分）
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.6",
    "motion": "^11.14.4",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "date-fns": "^4.1.0",
    "react-day-picker": "^9.4.3",
    "sonner": "2.0.3",
    "react-hook-form": "7.55.0",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.24.1"
  }
}
```

#### 2.2 创建 src 目录结构

在 StackBlitz 左侧文件树中：

1. **删除** 默认的 `src/App.tsx` 和 `src/App.css`

2. **创建** 以下文件结构：
```
src/
├── App.tsx              ← 从 Figma Make 复制
├── main.tsx             ← 从 Figma Make 复制
├── styles/
│   └── globals.css      ← 从 Figma Make 复制
├── components/          ← 创建目录并复制所有文件
├── utils/               ← 创建目录并复制所有文件
└── ...
```

### 步骤3：安装依赖

StackBlitz 会**自动安装**所有依赖，无需手动操作！

### 步骤4：启动预览

StackBlitz 会**自动启动**开发服务器并显示预览！

---

## 方式2：使用 WebContainer API（高级）

### 创建项目描述文件

```typescript
// stackblitz-config.js
import { WebContainer } from '@webcontainer/api';

const files = {
  'package.json': {
    file: {
      contents: `{
        "name": "agriverse",
        "private": true,
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build"
        },
        "dependencies": {
          // ... 所有依赖
        }
      }`
    }
  },
  'src/App.tsx': {
    file: {
      contents: `// 您的 App.tsx 代码`
    }
  },
  // ... 其他文件
};
```

---

## 方式3：导入 GitHub 仓库（推荐团队协作）

### 步骤1：创建 GitHub 仓库

```bash
# 本地初始化 Git
git init
git add .
git commit -m "feat: 初始化 AgriVerse 项目"

# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/agriverse.git
git push -u origin main
```

### 步骤2：在 StackBlitz 中打开

访问以下格式的URL：
```
https://stackblitz.com/github/YOUR_USERNAME/agriverse
```

StackBlitz 会自动：
- ✅ 克隆仓库
- ✅ 安装依赖
- ✅ 启动开发服务器
- ✅ 显示实时预览

---

## 📊 StackBlitz vs 本地环境对比

| 特性 | StackBlitz | 本地 Vite |
|------|-----------|----------|
| 启动速度 | ⚡⚡ 30秒 | ⚡⚡⚡ 5秒 |
| 内存限制 | ⚠️ 512MB | ✅ 无限制 |
| WebGL性能 | ⚠️ 中等 | ✅ 原生 |
| 分享能力 | ✅ 一键分享 | ❌ 需部署 |
| 协作编辑 | ✅ 支持 | ❌ 不支持 |
| 离线开发 | ❌ 需联网 | ✅ 支持 |

---

## 🎯 StackBlitz 最佳实践

### 1. 优化包大小

```json
// 只导入需要的组件
import { Button } from './components/ui/button'
// ✅ 好

import * as UI from './components/ui'
// ❌ 避免
```

### 2. 使用代码分割

```typescript
// 懒加载页面组件
const HomePage = lazy(() => import('./components/HomePage'))
const TradePage = lazy(() => import('./components/TradePage'))
```

### 3. 监控内存使用

```typescript
// 在 useEffect 中清理资源
useEffect(() => {
  const interval = setInterval(() => {
    // ...
  }, 1000)
  
  return () => clearInterval(interval)
}, [])
```

---

## 🐛 常见问题

### 问题1：依赖安装失败

**解决方案**：在 StackBlitz 终端中手动安装
```bash
npm install <package-name>
```

### 问题2：WebGL 渲染黑屏

**解决方案**：检查 Canvas 容器大小
```typescript
<div style={{ width: '100%', height: '100vh' }}>
  <canvas ref={canvasRef} />
</div>
```

### 问题3：Hot Reload 不工作

**解决方案**：刷新页面或重启 StackBlitz

### 问题4：TypeScript 错误

**解决方案**：添加类型声明
```typescript
// vite-env.d.ts
/// <reference types="vite/client" />
```

---

## 🔗 有用的链接

- **StackBlitz 文档**: https://developer.stackblitz.com/
- **Vite 文档**: https://vitejs.dev/
- **React 文档**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 💡 专业提示

### 快速分享项目

在 StackBlitz 中点击 **"Share"** 按钮，获得：
- 🔗 直接访问链接
- 📝 嵌入代码（可嵌入博客/文档）
- 👥 协作编辑链接

### 性能优化

```typescript
// 使用 React.memo 优化渲染
const ExpensiveComponent = React.memo(({ data }) => {
  // ...
})

// 使用 useMemo 缓存计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

---

## ✅ 验证清单

启动成功后检查：

- [ ] 页面正常显示
- [ ] 导航功能正常
- [ ] 3D 星球渲染（可能较慢）
- [ ] 无控制台错误
- [ ] 响应式布局正常

---

## 🚀 下一步

StackBlitz 启动成功后：

1. **测试核心功能**
   - 浏览所有页面
   - 测试交互功能
   - 检查响应式布局

2. **分享给团队**
   - 获取分享链接
   - 邀请协作编辑

3. **导出到本地**
   - 下载项目 ZIP
   - 或克隆到本地继续开发

---

**最后更新**: 2025-10-31  
**推荐指数**: ⭐⭐⭐⭐ (4/5)  
**适合场景**: 快速原型、演示、分享
