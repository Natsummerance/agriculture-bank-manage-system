# 🚀 登录星球 4.0 - 快速启动指南

## 一、立即体验

### 1. 启动应用

```bash
npm run dev
```

### 2. 切换到3D版本

1. 访问 `http://localhost:5173`
2. 点击左上角 **"3D WebGL 🚀"** 按钮
3. 享受沉浸式太阳系场景！

---

## 二、功能演示

### 🌟 基础交互

| 操作 | 效果 |
|------|------|
| **鼠标移动** | 悬停卫星显示信息卡 |
| **点击卫星** | 触发虫洞跃迁动画 |
| **滚轮向前** | 相机拉近（10单位） |
| **滚轮向后** | 相机拉远（25单位） |

### 🎵 音效控制

- 点击右上角 **音量图标** 开启/关闭音效
- 悬停卫星：440 Hz 正弦波
- 选中卫星：880 Hz 正弦波

### 🎨 主题切换

1. 点击右上角 **月亮/太阳** 图标
2. 场景自动切换日间/夜间模式
3. 800ms平滑过渡动画

---

## 三、场景元素说明

### 太阳系组成

```
┌─────────────────────────────────────┐
│  L1: 太阳 (左上角，金色耀斑)         │
│  L2: 内环行星×3 (岩石质感)           │
│  L3: 主星球 (中心，绿色+大气)        │
│  L4: 角色卫星×5 (外环，可点击)       │
│  L5: 小行星带 (中间环形区域)         │
│  L6: 星云背景 (彩色星星)             │
│  L7: 流星尾迹 (随机划过)             │
└─────────────────────────────────────┘
```

### 角色卫星分布

```
       🌾 农户 (0°)
         /  \
     🛒 /    \ ⚙️
  买家(72°)  管理员(288°)
      \      /
       \    /
        🏦 银行 (144°)
          👨‍🔬 专家 (216°)
```

---

## 四、性能档位

### 自动检测

打开应用后，左下角显示当前档位：

```
性能档位: HIGH
粒子数: 8,000
```

### 手动调整

编辑 `/utils/useCosmicPerformance.ts`：

```typescript
// 强制使用高性能档位
return {
  tier: 'high',
  particleCount: 8000,
  textureSize: 4096,
  targetFPS: 120,
  // ...
};
```

---

## 五、常见问题

### Q1: 场景黑屏？

**A**: 检查浏览器WebGL支持

```javascript
// 打开控制台
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
console.log('WebGL支持:', !!gl);
```

### Q2: 帧率过低？

**A**: 系统会自动降级，也可手动切换：

1. 点击左上角 **"2D Canvas"** 回退到3.0版本
2. 或者降低性能档位（见上文）

### Q3: 卫星点击无响应？

**A**: 确保鼠标位置准确

- 卫星检测半径：0.4单位（球体大小）
- 需要精确点击卫星球体中心区域
- 或增大检测范围（修改 `satGeometry` 半径）

### Q4: 音效无声音？

**A**: 检查音频权限

```typescript
// 点击右上角音量图标后
if (audioContext.state === 'suspended') {
  audioContext.resume();
}
```

---

## 六、自定义配置

### 修改卫星颜色

编辑 `/components/LoginPlanet4.tsx`：

```typescript
const satellites: Satellite[] = [
  {
    id: 'farmer',
    color: '#FF0000',  // 改为红色
    // ...
  }
];
```

### 调整轨道大小

```typescript
const satelliteOrbitRadius = 6;  // 改为8，卫星轨道更大
```

### 修改太阳位置

```typescript
sun.position.set(-30, 10, -60);  // 移动太阳到左上更远处
```

### 增加小行星数量

```typescript
const asteroidCount = 5000;  // 默认2000
```

---

## 七、版本对比

| 特性 | 3.0 (2D Canvas) | 4.0 (3D WebGL) |
|------|-----------------|----------------|
| **渲染技术** | Canvas 2D | WebGL |
| **场景复杂度** | 简单 | 复杂（7层） |
| **着色器** | 无 | 自定义GLSL |
| **光照** | 无 | 4种光源 |
| **性能开销** | 低 | 中-高 |
| **视觉效果** | 平面 | 立体 |
| **兼容性** | 100% | 95% |
| **加载时间** | <1s | 2-3s |
| **内存占用** | 50 MB | 150-250 MB |

---

## 八、快捷键（开发中）

| 按键 | 功能 |
|------|------|
| `Space` | 暂停/恢复动画 |
| `R` | 重置相机位置 |
| `T` | 切换主题 |
| `P` | 性能面板 |
| `F` | 全屏模式 |

---

## 九、浏览器兼容性

### ✅ 完全支持

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

### ⚠️ 部分支持

- Safari 13（无阴影）
- Firefox 85-87（性能降级）

### ❌ 不支持

- IE 11及以下（自动回退到2D版本）

---

## 十、性能建议

### 高配设备 (RTX 3060+)

```typescript
// 开启所有特效
enablePostProcessing: true
enableShadows: true
particleCount: 8000
textureSize: 4096
```

### 中配设备 (GTX 1050 / M1)

```typescript
// 平衡性能和效果（默认）
enablePostProcessing: true
enableShadows: true
particleCount: 5000
textureSize: 2048
```

### 低配设备 (核显 / 手机)

```typescript
// 优先保证流畅度
enablePostProcessing: false
enableShadows: false
particleCount: 2000
textureSize: 1024
```

或直接使用 **2D Canvas** 版本！

---

## 🎯 下一步

1. **体验完整流程**：选择卫星 → 登录 → 进入仪表盘
2. **查看技术文档**：`/PLANET_4.0_TECHNICAL_GUIDE.md`
3. **自定义场景**：修改着色器、添加新行星
4. **优化性能**：根据目标设备调整配置

---

## 🆘 需要帮助？

- **技术问题**: 查看 `/PLANET_4.0_TECHNICAL_GUIDE.md`
- **性能问题**: 查看性能档位配置
- **Bug反馈**: 提交Issue并附上控制台日志

---

**祝您探索愉快！** 🚀🌌✨

**版本**: 4.0.0  
**更新日期**: 2025-10-31
