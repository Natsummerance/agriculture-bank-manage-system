# 🚀 星云·AgriVerse 本地部署指南

## 如果Figma Make环境有问题，如何在本地运行代码？

### 方案一：快速本地开发环境（推荐）

#### 1. 准备工作
```bash
# 创建项目目录
mkdir agriverse
cd agriverse

# 初始化 Vite + React + TypeScript 项目
npm create vite@latest . -- --template react-ts

# 安装依赖
npm install
```

#### 2. 安装所需依赖包
```bash
# 核心依赖
npm install react react-dom
npm install -D @types/react @types/react-dom

# UI组件库
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar @radix-ui/react-checkbox
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-popover
npm install @radix-ui/react-progress @radix-ui/react-radio-group
npm install @radix-ui/react-select @radix-ui/react-separator
npm install @radix-ui/react-slider @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-tooltip
npm install @radix-ui/react-slot

# 动画和图标
npm install motion lucide-react
npm install framer-motion  # 如果 motion 不可用

# 图表和可视化
npm install recharts

# 工具库
npm install class-variance-authority clsx tailwind-merge
npm install date-fns
npm install react-day-picker

# Toast通知
npm install sonner@2.0.3

# 表单处理
npm install react-hook-form@7.55.0 @hookform/resolvers zod

# Tailwind CSS
npm install -D tailwindcss@next postcss autoprefixer
npx tailwindcss init -p
```

#### 3. 配置 Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aurora-cyan': '#00D6C2',
        'bio-green': '#18FF74',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 4. 复制文件结构
```
将 Figma Make 中的文件按以下结构复制到本地：

agriverse/
├── src/
│   ├── App.tsx                    # 从 /App.tsx 复制
│   ├── main.tsx                   # 创建入口文件（见下方）
│   ├── components/                # 从 /components 复制整个目录
│   ├── styles/
│   │   └── globals.css           # 从 /styles/globals.css 复制
│   └── utils/                    # 从 /utils 复制
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

#### 5. 创建入口文件

**src/main.tsx:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**index.html:**
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>星云·AgriVerse</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### 6. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 即可查看应用！

---

### 方案二：在线快速预览（零配置）

#### 使用 CodeSandbox
1. 访问 https://codesandbox.io/
2. 选择 "Vite React TypeScript" 模板
3. 将代码文件粘贴进去
4. 安装依赖后即可运行

#### 使用 StackBlitz
1. 访问 https://stackblitz.com/
2. 选择 "React TypeScript" 模板
3. 复制代码文件
4. 自动安装依赖并运行

---

### 方案三：导出为静态网站

#### 构建生产版本
```bash
# 构建
npm run build

# 预览构建结果
npm run preview

# 构建产物在 dist/ 目录
```

#### 部署到云平台
```bash
# Vercel (推荐)
npm i -g vercel
vercel

# Netlify
npm i -g netlify-cli
netlify deploy

# GitHub Pages
# 将 dist/ 目录推送到 gh-pages 分支
```

---

## 🔧 常见问题排查

### 1. WebGL Canvas 黑屏或性能问题
```typescript
// 在 WebGLSphere.tsx 中检查是否正确清理资源
useEffect(() => {
  // ... WebGL 初始化代码
  
  return () => {
    // 确保清理所有资源
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (gl) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    }
  };
}, []);
```

### 2. 图片加载失败
```typescript
// 使用 ImageWithFallback 组件
// 或在本地环境使用普通 <img> 标签
<img 
  src="/path/to/image.png" 
  alt="描述"
  onError={(e) => {
    e.currentTarget.src = 'https://via.placeholder.com/400';
  }}
/>
```

### 3. 依赖导入错误
```bash
# 如果某个包导入失败，单独安装
npm install <package-name>

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 性能优化建议

### 本地开发环境性能更好的原因：
1. **无沙箱限制** - 浏览器直接运行，无 Worker 隔离
2. **更好的调试工具** - Chrome DevTools 完整功能
3. **HMR 热更新** - Vite 提供极快的模块热替换
4. **内存管理** - 无 Figma 环境的内存限制

### 推荐的开发流程：
```
1. 在 Figma Make 中快速原型设计
2. 导出代码到本地环境进行性能优化
3. 在本地测试 WebGL、动画等重型功能
4. 部署到云平台进行真实环境测试
```

---

## 🎯 下一步

完成本地环境搭建后，您可以：

✅ 使用完整的浏览器 DevTools 调试 WebGL
✅ 测试完整的性能表现（无 Worker 限制）
✅ 添加后端 API（Node.js/Supabase）
✅ 部署到生产环境供真实用户使用
✅ 使用 Git 进行版本控制

---

## 💡 提示

如果您只是想快速查看效果：
- 使用 **StackBlitz** - 最快，在线直接运行
- 使用 **CodeSandbox** - 功能强大，支持完整项目

如果您要做长期开发：
- 使用 **本地 Vite 环境** - 最佳性能和灵活性
- 配合 **VS Code** - 最佳开发体验

---

**创建日期**: 2025-10-31  
**适用版本**: 星云·AgriVerse SP1 及后续版本
