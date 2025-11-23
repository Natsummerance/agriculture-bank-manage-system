# ⚡ 主题切换系统快速测试指南

## 🎯 一分钟快速测试

### 方法1: 手动切换
```
1. 打开应用（等待登录星球出现）
2. 找到右上角太阳图标 ☀️
3. 点击图标
4. 观察：
   ✓ 图标旋转 360°
   ✓ 径向擦除动画（800ms）
   ✓ 月亮图标 🌙 出现
   ✓ 背景变成深色
   ✓ 文字变成白色
   ✓ 霓虹发光效果
5. 再次点击 → 切回日间
```

### 方法2: 跨Tab同步测试
```
1. 打开应用（Tab A）
2. 复制 URL，新标签页打开（Tab B）
3. 在 Tab A 点击主题切换
4. 查看 Tab B → 自动同步！
5. 在 Tab B 切换 → Tab A 同步！
```

### 方法3: 跟随系统
```
1. 打开应用
2. F12 → Console
3. 输入: localStorage.removeItem('agriverse-theme')
4. 刷新页面
5. 切换系统深色模式 → 应用自动跟随
```

---

## 🎨 视觉检查清单

### ✅ 日间模式（Day）

**导航栏**:
- [ ] 白色背景
- [ ] 黑色文字
- [ ] 青色图标
- [ ] 太阳图标 ☀️
- [ ] 轻微阴影

**登录星球**:
- [ ] 白色星空背景
- [ ] 卫星明亮光晕
- [ ] 暖色系轨道
- [ ] 信息卡白底

**按钮/卡片**:
- [ ] 白色底色
- [ ] 灰色边框
- [ ] 柔和阴影
- [ ] 无霓虹发光

### ✅ 夜间模式（Night）

**导航栏**:
- [ ] 深色背景 (#121726)
- [ ] 白色文字
- [ ] 绿色图标
- [ ] 月亮图标 🌙
- [ ] 霓虹边框

**登录星球**:
- [ ] 深黑星空 (#0A0A0D)
- [ ] 卫星霓虹光晕
- [ ] 冷色系轨道
- [ ] 信息卡暗底

**按钮/卡片**:
- [ ] 深色底色 (#1C212E)
- [ ] 霓虹边框
- [ ] 发光效果
- [ ] 粒子尾迹更亮

---

## 🔄 过渡动画检查

### 完整动画（默认）

**触发**:
- 点击主题切换按钮

**观察**:
1. **0-400ms**: 图标旋转
2. **400-800ms**: 径向擦除扩散
3. **同时**: 20颗粒子爆发
4. **中央**: 太阳/月亮图标脉冲
5. **800ms后**: 动画完成

### 减少动画（prefers-reduced-motion）

**测试**:
```
1. 打开系统设置
2. 启用"减少动画"
3. 刷新应用
4. 切换主题 → 瞬间切换（无动画）
```

---

## 💾 持久化测试

### localStorage 保存

```javascript
// F12 Console 测试
localStorage.getItem('agriverse-theme')
// 应该返回: 'day' 或 'night' 或 'auto'

// 设置夜间
localStorage.setItem('agriverse-theme', 'night')
location.reload()
// 刷新后应该是夜间模式
```

### 无闪烁加载

```
1. 设置为夜间模式
2. 硬刷新页面 (Ctrl+Shift+R)
3. 观察：页面加载时应该直接是夜间
4. 不应该有"先白后黑"的闪烁
```

---

## 🌐 多租户白标测试

### 基础测试

```javascript
// F12 Console
import { applyTenantTheme } from './utils/useTheme';

// 应用自定义主题
applyTenantTheme({
  'brand-primary': '#FF0000',  // 红色主色
  'brand-secondary': '#0000FF' // 蓝色辅色
});

// 查看效果：
// - 按钮变成红色
// - 链接变成红色
// - 发光变成红色
```

### 移除测试

```javascript
import { removeTenantTheme } from './utils/useTheme';

removeTenantTheme();
// 恢复默认青绿色系
```

---

## 🎮 交互测试

### 键盘导航

```
1. Tab 键导航到主题切换按钮
2. 按下 Enter 或 Space
3. 主题应该切换
4. 焦点环应该可见
```

### 移动端

```
1. 打开移动端模拟器
2. 点击主题切换按钮
3. 触摸反馈应该流畅
4. 动画应该 60fps
```

---

## 📊 性能测试

### FPS 监控

```
1. F12 → Performance
2. 开始录制
3. 点击主题切换
4. 停止录制
5. 检查 FPS → 应该 ≥55fps
```

### 内存占用

```
1. F12 → Memory
2. 记录初始内存
3. 切换主题 10 次
4. 再次记录内存
5. 增长应该 <10MB
```

### 网络（首次加载）

```
1. F12 → Network
2. 硬刷新页面
3. 检查 theme.css
4. 文件大小应该 <10KB
5. 加载时间 <100ms
```

---

## 🐛 故障排查

### 问题1: 主题不切换

**检查**:
```javascript
// Console
console.log(document.documentElement.getAttribute('data-theme'));
// 应该输出: 'day' 或 'night'

console.log(getComputedStyle(document.body).getPropertyValue('--bg-main'));
// 日间: rgb(255, 255, 255)
// 夜间: rgb(10, 10, 13)
```

### 问题2: 动画卡顿

**检查**:
```
1. 查看 Console 是否有错误
2. 检查 GPU 是否启用
3. 降低粒子数量（编辑 ThemeTransition.tsx）
4. 禁用 backdrop-filter
```

### 问题3: 跨Tab不同步

**检查**:
```javascript
// Console
if ('BroadcastChannel' in window) {
  console.log('✓ BroadcastChannel 支持');
} else {
  console.log('✗ 不支持（需要降级方案）');
}
```

---

## 🎯 完整测试流程（5分钟）

### 第1分钟: 基础切换
- [ ] 点击切换按钮
- [ ] 观察动画
- [ ] 检查颜色变化

### 第2分钟: 跨Tab同步
- [ ] 打开第二个标签页
- [ ] 在任一Tab切换
- [ ] 验证同步

### 第3分钟: 持久化
- [ ] 切换到夜间
- [ ] 刷新页面
- [ ] 验证保持夜间

### 第4分钟: 性能
- [ ] 打开Performance面板
- [ ] 录制切换过程
- [ ] 检查FPS

### 第5分钟: 可访问性
- [ ] 键盘导航测试
- [ ] 对比度检查
- [ ] 减少动画测试

---

## ✨ 彩蛋测试

### 快速切换
```
连续点击主题按钮 5 次
→ 应该流畅不卡顿
→ 动画队列正确处理
```

### 系统联动
```
1. 设置为 'auto' 模式
2. 切换系统深色模式
3. 应用自动跟随
4. 无需刷新
```

### 白标预览
```javascript
// 模拟企业主题
applyTenantTheme({
  'brand-primary': '#E60012',    // 京东红
  'brand-secondary': '#FFD700',  // 金色
  'bg-main': '#F5F5F5'           // 灰背景
});

// 或
applyTenantTheme({
  'brand-primary': '#00C1DE',    // 支付宝蓝
  'brand-secondary': '#1677FF',
  'bg-main': '#FFFFFF'
});
```

---

## 📞 问题反馈

### 查看主题状态

```javascript
// 粘贴到 Console
const theme = localStorage.getItem('agriverse-theme');
const dataTheme = document.documentElement.getAttribute('data-theme');
const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-main');

console.table({
  '保存的主题': theme,
  '应用的主题': dataTheme,
  '背景颜色': bgColor,
  '浏览器支持': {
    'BroadcastChannel': 'BroadcastChannel' in window,
    'CSS Variables': CSS.supports('color', 'var(--test)'),
    'prefers-color-scheme': window.matchMedia('(prefers-color-scheme: dark)').matches
  }
});
```

---

**测试愉快！🌓**
