# 📦 AgriVerse 代码导出清单

## 🎯 导出前检查

### 核心文件（必须）
- [ ] `/App.tsx` - 主应用组件
- [ ] `/styles/globals.css` - 全局样式
- [ ] `/components/` - 所有组件目录

### 功能组件（必须）
- [ ] `/components/HomePage.tsx`
- [ ] `/components/TradePage.tsx`
- [ ] `/components/FinancePage.tsx`
- [ ] `/components/ExpertPage.tsx`
- [ ] `/components/ProfilePage.tsx`
- [ ] `/components/Navigation.tsx`
- [ ] `/components/WebGLSphere.tsx`
- [ ] `/components/HeatmapSphere.tsx`
- [ ] `/components/LoginPlanet.tsx`

### SP1 增量功能（必须）
- [ ] `/components/finance/QuantumMatch.tsx`
- [ ] `/components/finance/DemandPublisher.tsx`
- [ ] `/components/finance/DemandManagement.tsx`
- [ ] `/components/finance/DemandDetail.tsx`
- [ ] `/components/finance/ContractSigning.tsx`
- [ ] `/components/finance/CompareSlider.tsx`
- [ ] `/components/finance/RepaymentGame.tsx`
- [ ] `/components/finance/FinanceGateway.tsx`
- [ ] `/components/blockchain/BlockchainExplorer.tsx`
- [ ] `/components/bank/BankRadar.tsx`
- [ ] `/components/bank/JointLoanHub.tsx`
- [ ] `/components/expert/ExpertRating.tsx`
- [ ] `/components/MessageCenter.tsx`

### UI 组件库（必须）
- [ ] `/components/ui/` - 整个 Shadcn UI 目录

### 工具文件（推荐）
- [ ] `/utils/startup.ts` - 启动工具
- [ ] `/components/ErrorBoundary.tsx` - 错误边界
- [ ] `/components/StarLoader.tsx` - 加载动画

### 文档（可选但推荐）
- [ ] `/README.md`
- [ ] `/SP1_COMPLETION_REPORT.md`
- [ ] `/V2_COMPLETION_REPORT.md`
- [ ] `/INCREMENTAL_FEATURES.md`
- [ ] `/LOCAL_DEPLOYMENT_GUIDE.md` ⭐ 新建

---

## 🚫 无需导出的文件

这些是诊断和文档文件，不影响应用运行：

```
❌ 错误诊断文档（约30个 .md/.txt 文件）
   - ERROR_*.md
   - FIGMA_*.md
   - 所有带表情符号前缀的文件
   - STATUS.txt
   - READ_ME_FIRST.txt
   等等...

❌ 测试文件
   - App_MINIMAL_TEST.tsx
   - App_GRADUAL_LOAD.tsx
   - WorkerDiagnostic.tsx

❌ Figma 特有组件
   - /components/figma/ImageWithFallback.tsx
   (本地环境用 <img> 替代)
```

---

## 📋 快速导出步骤

### 方法1：手动复制（推荐新手）

1. **创建本地项目结构**
```
agriverse/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    ├── styles/
    └── utils/
```

2. **逐个复制文件**
   - 从 Figma Make 复制 `/App.tsx` 内容
   - 粘贴到本地 `src/App.tsx`
   - 重复所有必须文件

3. **调整导入路径**
```typescript
// Figma Make 中:
import { Button } from "./components/ui/button"

// 本地环境保持不变（如果文件在 src/ 下）
import { Button } from "./components/ui/button"
```

---

### 方法2：选择性导出（推荐进阶）

只导出您需要的功能模块：

#### 最小可运行版本（~10个文件）
```
✅ App.tsx
✅ styles/globals.css
✅ components/Navigation.tsx
✅ components/HomePage.tsx
✅ components/ui/* (必要的UI组件)
```

#### 包含3D功能版本（+3个文件）
```
+ WebGLSphere.tsx
+ HeatmapSphere.tsx
+ LoginPlanet.tsx
```

#### 完整版（所有功能）
```
导出上述清单中所有"必须"和"推荐"文件
```

---

## 🔄 导入路径转换

### Figma Make → 本地环境

```typescript
// 图片导入（如果使用了 Unsplash 或占位图）
// Figma Make:
import { ImageWithFallback } from './components/figma/ImageWithFallback'

// 本地环境:
// 直接使用 <img> 标签或安装 ImageWithFallback 的替代方案
<img src="..." alt="..." />
```

```typescript
// 相对路径保持不变
import { Button } from "./components/ui/button"
import { HomePage } from "./components/HomePage"
// ✅ 这些在本地环境中无需修改
```

---

## 🎨 样式文件处理

### globals.css
确保在 `main.tsx` 中导入：
```typescript
import './styles/globals.css'
```

### Tailwind 配置
从 `globals.css` 中提取颜色变量到 `tailwind.config.js`：
```javascript
theme: {
  extend: {
    colors: {
      'aurora-cyan': '#00D6C2',
      'bio-green': '#18FF74',
    }
  }
}
```

---

## ✅ 导出后验证

### 1. 检查依赖
```bash
npm install
# 如果有缺失依赖，根据错误提示安装
```

### 2. 检查编译错误
```bash
npm run dev
# 查看终端是否有 TypeScript 错误
```

### 3. 检查浏览器控制台
```javascript
// 打开 http://localhost:5173
// F12 → Console
// 确保没有红色错误
```

### 4. 测试核心功能
- [ ] 页面切换正常
- [ ] 3D 星球渲染正常
- [ ] 动画流畅（无卡顿）
- [ ] 表单提交正常
- [ ] 响应式布局正常

---

## 🐛 常见导出问题

### 问题1: "Cannot find module"
```bash
# 解决方案：安装缺失的包
npm install <missing-package>
```

### 问题2: TypeScript 类型错误
```typescript
// 添加类型声明
// vite-env.d.ts
/// <reference types="vite/client" />
```

### 问题3: CSS 未生效
```typescript
// 确保在 main.tsx 中导入
import './styles/globals.css'
```

### 问题4: WebGL 黑屏
```typescript
// 检查 Canvas 的父容器是否有明确的宽高
<div style={{ width: '100%', height: '100vh' }}>
  <canvas ref={canvasRef} />
</div>
```

---

## 📊 文件大小参考

```
总代码量: ~15,000 行
总文件数: ~40 个核心文件
node_modules: ~300MB (首次安装)
构建产物: ~2MB (gzip 后)
```

---

## 🚀 导出后的下一步

1. **本地开发**
   ```bash
   npm run dev
   ```

2. **生产构建**
   ```bash
   npm run build
   npm run preview
   ```

3. **部署到云平台**
   - Vercel: `vercel`
   - Netlify: `netlify deploy`
   - GitHub Pages: 推送 `dist/` 到 `gh-pages` 分支

---

## 💡 专业建议

### 推荐工作流
```
Figma Make (原型) 
    ↓
本地环境 (开发 & 优化)
    ↓
Git 仓库 (版本控制)
    ↓
云平台 (部署 & 测试)
```

### 版本控制
```bash
git init
git add .
git commit -m "feat: 初始化 AgriVerse 项目"
git remote add origin <your-repo>
git push -u origin main
```

---

**最后更新**: 2025-10-31  
**适用版本**: AgriVerse SP1+
