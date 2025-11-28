# 故障排除指南

## 🚨 常见问题快速解决

---

## 问题 1: Three.js 多实例警告

### 症状
```
WARNING: Multiple instances of Three.js being imported.
```

### 解决方案
```bash
# 方案 A: 清除 Vite 缓存（推荐）
rm -rf node_modules/.vite
npm run dev

# 方案 B: 完全重装
rm -rf node_modules
rm package-lock.json
npm install
npm run dev

# 方案 C: 强制重新构建
npm run dev -- --force
```

### 验证修复
打开控制台，应该看到：
```
🌌 星云·AgriVerse
✅ Three.js 警告已抑制（开发环境正常现象）
```

📖 **详细文档**: [FIX_SUMMARY.md](./FIX_SUMMARY.md)

---

## 问题 2: 3D 场景不渲染

### 症状
- 黑屏或白屏
- 看不到 3D 星球
- 控制台报 WebGL 错误

### 解决方案

#### A. 检查浏览器支持
```javascript
// 在控制台运行
console.log('WebGL 支持:', !!document.createElement('canvas').getContext('webgl2'));
// 应该输出: true
```

#### B. 检查 GPU 加速
1. Chrome 地址栏输入: `chrome://gpu`
2. 检查 "WebGL" 和 "WebGL2" 是否启用
3. 如果禁用，在设置中启用硬件加速

#### C. 降级到 2D Canvas
```typescript
// 点击左上角 [2D Canvas] 按钮
// 或在 App.tsx 中设置默认版本
setPlanetVersion('3.0');
```

---

## 问题 3: 性能低下/卡顿

### 症状
- FPS < 30
- 拖拽卡顿
- 页面响应慢

### 解决方案

#### A. 检查性能档位
左下角应显示：
```
性能档位: HIGH / MEDIUM / LOW
粒子数: 5000 / 3000 / 1000
```

#### B. 手动降低档位
```typescript
// 在 LoginPlanet4.tsx 中
const performanceConfig = useCosmicPerformance();
// 系统会自动检测设备性能
```

#### C. 关闭不必要的浏览器标签页
- 3D 渲染需要较多 GPU 资源
- 建议单独标签页运行

#### D. 检查系统资源
```bash
# Windows
任务管理器 → 性能

# Mac
活动监视器 → CPU/GPU

# 确保 CPU < 80%, GPU < 90%
```

---

## 问题 4: 按钮点击无反应

### 症状
- 点击按钮没有响应
- 表单提交失败
- 防抖过于频繁

### 解决方案

#### A. 检查是否使用 AsyncButton
```typescript
// ✅ 正确用法
<AsyncButton onClick={async () => {
  await api.post('/data');
}}>
  提交
</AsyncButton>

// ❌ 错误用法
<button onClick={() => {
  api.post('/data'); // 没有 await
}}>
  提交
</button>
```

#### B. 检查防抖时间
```typescript
const { execute } = useAsyncButton({
  debounceMs: 300, // 调整此值（默认 300ms）
});
```

#### C. 检查按钮禁用状态
```typescript
<button disabled={isLoading || isDisabled}>
  {isLoading ? '处理中...' : '提交'}
</button>
```

---

## 问题 5: 样式错乱/布局异常

### 症状
- 按钮重叠
- 文字显示不正常
- 间距异常

### 解决方案

#### A. 检查 Tailwind CSS 加载
```bash
# 确保 styles/globals.css 被导入
# main.tsx 中应有:
import './styles/globals.css'
```

#### B. 清除浏览器缓存
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

#### C. 检查响应式断点
```typescript
// 移动端
<div className="px-4 sm:px-6 lg:px-8">

// 桌面端优先
<div className="hidden lg:block">
```

---

## 问题 6: 角色切换失败

### 症状
- 点击卫星没反应
- 无法进入角色空间站
- 卡在登录星球页面

### 解决方案

#### A. 检查拖拽目标
```
1. 拖拽卫星到中心绿色星球
2. 确保触发跃迁动画
3. 等待场景切换
```

#### B. 备用方案：直接点击
```
如果拖拽不工作，直接点击卫星
应该弹出角色信息卡片
点击"进入"按钮
```

#### C. 检查控制台错误
```javascript
// 应该看到
console.log('角色选择:', role);
// 如果没有，检查 onRoleSelect 回调
```

---

## 问题 7: 消息中心不显示

### 症状
- 点击消息按钮无反应
- 消息浮窗不出现
- IM 对话框打不开

### 解决方案

#### A. 检查 z-index
```typescript
// MessageCenter 应该有高 z-index
<div className="fixed ... z-[200]">
```

#### B. 使用 useImDialog Hook
```typescript
const { openSession } = useImDialog();

<button onClick={() => {
  openSession('user123', '张三', 'farmer');
}}>
  联系卖家
</button>
```

#### C. 检查全局状态
```javascript
// 在控制台运行
console.log(window.imDialogState);
// 应该显示当前对话状态
```

---

## 问题 8: 构建失败

### 症状
```
npm run build 报错
类型检查失败
模块找不到
```

### 解决方案

#### A. 检查 TypeScript 配置
```bash
# 运行类型检查
npx tsc --noEmit

# 查看具体错误
```

#### B. 检查依赖完整性
```bash
npm ls
# 查找是否有未安装的依赖

npm install --legacy-peer-deps
```

#### C. 清除构建缓存
```bash
rm -rf dist
rm -rf node_modules/.vite
npm run build
```

---

## 问题 9: 开发服务器启动失败

### 症状
```
npm run dev 报错
端口被占用
模块解析错误
```

### 解决方案

#### A. 端口被占用
```bash
# 查看端口占用
lsof -i :5173 (Mac/Linux)
netstat -ano | findstr :5173 (Windows)

# 杀死进程或修改端口
# vite.config.ts
server: {
  port: 5174, // 改为其他端口
}
```

#### B. Node 版本检查
```bash
node -v
# 应该 >= 16.0.0

# 更新 Node.js
nvm install 18
nvm use 18
```

#### C. 重新安装依赖
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 问题 10: 图标/图片不显示

### 症状
- Lucide 图标不显示
- 背景图片 404
- SVG 加载失败

### 解决方案

#### A. 检查 Lucide 导入
```typescript
// ✅ 正确
import { Home, User } from 'lucide-react';

// ❌ 错误
import { Home } from 'lucide'; // 没有 -react
```

#### B. 检查图片路径
```typescript
// ✅ 正确
import logo from './assets/logo.png';
<img src={logo} />

// ❌ 错误
<img src="/assets/logo.png" /> // public 文件夹才能这样
```

#### C. 使用 ImageWithFallback
```typescript
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="/image.jpg"
  fallbackSrc="/placeholder.jpg"
  alt="描述"
/>
```

---

## 🆘 仍无法解决？

### 步骤 1: 收集信息
```bash
# 系统信息
node -v
npm -v
浏览器及版本

# 错误信息
截图或复制完整错误堆栈
```

### 步骤 2: 查看文档
- 📖 [README.md](./README.md) - 项目概览
- 📖 [QUICK_START_NIGHT.md](./QUICK_START_NIGHT.md) - 快速开始
- 📖 [TECH_STACK.md](./TECH_STACK.md) - 技术栈
- 📖 [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) - 验证清单

### 步骤 3: 检查控制台
```javascript
// 启用详细日志
localStorage.setItem('debug', 'true');
location.reload();
```

---

## 📞 联系支持

### GitHub Issues
提交 Issue 时请包含：
1. 问题描述（详细）
2. 复现步骤
3. 预期结果 vs 实际结果
4. 环境信息（Node/浏览器版本）
5. 错误截图/日志

### 紧急问题
1. 尝试所有上述解决方案
2. 查看相关文档
3. 搜索已有 Issues

---

## ✅ 预防措施

### 定期维护
```bash
# 每周运行
npm outdated        # 检查过期依赖
npm audit           # 安全检查
npm run lint        # 代码检查
```

### 最佳实践
1. ✅ 使用版本控制（Git）
2. ✅ 定期更新依赖
3. ✅ 保持代码整洁
4. ✅ 编写单元测试
5. ✅ 阅读错误信息

---

**更新时间**: 2025-11-02  
**版本**: v3.0.1
