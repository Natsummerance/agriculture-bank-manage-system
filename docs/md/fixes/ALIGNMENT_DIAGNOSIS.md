# 🔍 星球界面对齐诊断指南

**版本**: v2.5 - 整体对齐修复  
**修复时间**: 2025-10-31  
**状态**: 🔧 诊断中

---

## 🎯 已修复的问题

### ✅ 1. 响应式中心点动态计算
**问题**: centerX/centerY在window resize时不更新  
**修复**: 改用`getCenter()`函数动态计算

```typescript
// ❌ 旧方案（静态，resize后不更新）
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// ✅ 新方案（动态，实时更新）
const getCenter = () => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
});

// 每次绘制时获取最新中心
const { x: centerX, y: centerY } = getCenter();
```

### ✅ 2. 所有绘制函数已更新
- `drawStarfield()` ✅
- `drawCorePlanet()` ✅
- `drawOrbits()` ✅
- `drawSatellites()` ✅

---

## 🔍 请检查以下对齐情况

### 检查项 1: 星球是否在屏幕中心？
- [ ] 水平居中（左右留白相等）
- [ ] 垂直居中（上下留白相等）
- [ ] 全屏时居中
- [ ] 缩小窗口时仍居中

### 检查项 2: 卫星轨道是否对称？
- [ ] 5个卫星均匀分布
- [ ] 轨道是完整椭圆（不被裁切）
- [ ] 悬停时光束指向星球中心

### 检查项 3: UI元素是否对齐？
- [ ] 顶部Logo水平居中
- [ ] 底部提示水平居中
- [ ] 右侧信息卡垂直居中
- [ ] Canvas填满整个屏幕

### 检查项 4: 响应式是否正常？
- [ ] 窗口缩放时星球位置动态更新
- [ ] 移动端/平板显示正常
- [ ] 高DPI屏幕（Retina）显示正常

---

## 📊 布局结构

```
<div className="fixed inset-0">         // ✅ 全屏容器
  <canvas className="absolute inset-0">  // ✅ Canvas全屏
    星球中心: window.innerWidth/2, window.innerHeight/2
  </canvas>
  
  <div className="absolute top-12 left-1/2 -translate-x-1/2">  // ✅ 顶部居中
    星云·AgriVerse
  </div>
  
  <div className="fixed right-12 top-1/2 -translate-y-1/2">  // ✅ 右侧垂直居中
    信息卡
  </div>
  
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2">  // ✅ 底部居中
    角色提示
  </div>
</div>
```

---

## 🐛 可能的问题场景

### 场景1: 星球偏移某个方向
**症状**: 星球明显偏左/右/上/下  
**可能原因**:
- CSS margin/padding影响
- 浏览器滚动条占用空间
- 父容器定位问题

**检查方法**:
```javascript
// 在浏览器控制台执行
console.log('Window Size:', window.innerWidth, window.innerHeight);
console.log('Canvas Size:', canvas.width, canvas.height);
console.log('Device Pixel Ratio:', window.devicePixelRatio);
```

### 场景2: 卫星轨道被裁切
**症状**: 卫星运动到边缘时消失  
**可能原因**:
- 轨道半径过大
- Canvas尺寸计算错误
- overflow:hidden裁切

**解决方案**:
```typescript
// 动态调整轨道大小
const maxOrbitA = Math.min(window.innerWidth, window.innerHeight) * 0.4;
```

### 场景3: 高DPI屏幕模糊
**症状**: Retina屏幕上Canvas模糊  
**已解决**: 
```typescript
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
```

### 场景4: 窗口resize后错位
**症状**: 调整窗口大小后星球不在中心  
**已解决**: 使用`getCenter()`动态计算

---

## 🎯 快速测试步骤

1. **全屏测试**
   - 按F11全屏，检查星球是否居中
   - 退出全屏，检查是否仍居中

2. **缩放测试**
   - 拖动窗口边缘调整大小
   - 观察星球是否始终居中
   - 检查卫星是否始终可见

3. **设备测试**
   - Chrome开发者工具切换设备（Ctrl+Shift+M）
   - 测试iPhone/iPad/Desktop各尺寸
   - 检查触摸交互（如支持）

4. **滚动测试**
   - 向下滚动页面
   - 星球应该保持fixed定位不动

---

## 💡 如何描述问题

如果仍有对齐问题，请提供：

1. **具体位置**: "星球偏右约50px" / "卫星被顶部裁切"
2. **截图**: 标注出不对齐的部分
3. **设备信息**: 
   - 浏览器: Chrome 119 / Safari 17
   - 屏幕尺寸: 1920×1080 / 2560×1440
   - DPI: 1x / 2x (Retina)
4. **复现步骤**: "刷新页面后..." / "调整窗口后..."

---

## 🔧 临时调试代码

在浏览器控制台执行，绘制辅助线：

```javascript
// 获取Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 绘制十字线（中心）
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(window.innerWidth/2, 0);
ctx.lineTo(window.innerWidth/2, window.innerHeight);
ctx.moveTo(0, window.innerHeight/2);
ctx.lineTo(window.innerWidth, window.innerHeight/2);
ctx.stroke();

// 绘制边界框
ctx.strokeStyle = 'yellow';
ctx.strokeRect(10, 10, window.innerWidth-20, window.innerHeight-20);
```

---

## ✅ 修复清单

- [x] Canvas尺寸正确设置（含devicePixelRatio）
- [x] 中心点动态计算（响应式）
- [x] 所有绘制函数使用动态中心点
- [x] HTML元素使用Tailwind居中类
- [x] Canvas填满整个视口
- [ ] **待确认**: 实际视觉效果是否居中

---

**下一步**: 请描述具体哪里不对齐，我将精准修复！🎯
