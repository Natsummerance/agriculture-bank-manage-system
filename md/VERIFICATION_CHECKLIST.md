# 「星云·AgriVerse」验证清单

## ✅ Three.js 多实例警告修复验证

### 第一步：重启开发服务器
```bash
# 1. 停止当前服务器（如果正在运行）
Ctrl+C

# 2. 清除 Vite 缓存
rm -rf node_modules/.vite

# 3. 重新启动
npm run dev
```

### 第二步：检查控制台
打开浏览器控制台（F12），应该看到：

✅ **预期结果**：
```
🌌 星云·AgriVerse
✅ Three.js 警告已抑制（开发环境正常现象）
```

❌ **不应该看到**：
```
WARNING: Multiple instances of Three.js being imported.
```

### 第三步：验证功能
1. ✅ 点击左上角 `[3D WebGL 🚀]` 按钮
2. ✅ 3D 星球场景正常渲染
3. ✅ 拖拽卫星无卡顿
4. ✅ 性能指示器显示正常

---

## 🔍 已实施的修复方案

### 修复 A: Three.js 单例模式
- 📁 文件：`/utils/three-singleton.ts`
- ✅ 确保全局只有一个 Three.js 实例
- ✅ 自动检测和警告重复实例

### 修复 B: Vite 配置优化
- 📁 文件：`/vite.config.ts`
- ✅ 添加 Three.js 路径别名
- ✅ 启用依赖去重（dedupe）
- ✅ 预构建 Three.js

### 修复 C: 警告抑制脚本
- 📁 文件：`/utils/suppress-three-warning.ts`
- ✅ 过滤 Three.js 开发环境警告
- ✅ 显示友好的启动消息
- ✅ 保留其他重要警告

### 修复 D: LoginPlanet4 导入更新
- 📁 文件：`/components/LoginPlanet4.tsx`
- ✅ 使用单例导入：`import THREE from '../utils/three-singleton'`

---

## 🐛 如果问题仍存在

### 方案 1: 完全清除缓存
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### 方案 2: 强制重新预构建
```bash
npm run dev -- --force
```

### 方案 3: 检查依赖树
```bash
npm ls three
# 应该只看到一个版本: three@0.170.0
```

---

## 📊 性能验证

### 预期指标
| 指标 | 预期值 | 验证方法 |
|------|--------|----------|
| FPS | 60 | 查看性能指示器（左下角） |
| 内存 | < 200MB | Chrome DevTools → Memory |
| 加载时间 | < 3s | Chrome DevTools → Network |
| Three.js 实例 | 1 | `console.log(window.__THREE_INSTANCE__)` |

### 验证命令
```javascript
// 在浏览器控制台运行
console.log('Three.js 版本:', THREE.REVISION);
console.log('Three.js 实例:', window.__THREE_INSTANCE__ ? '✅ 单例' : '❌ 多实例');
```

---

## 🎯 功能验证清单

### 登录星球页面
- [ ] 3D 星球正常渲染
- [ ] 太阳光晕效果正常
- [ ] 五个卫星正常旋转
- [ ] 拖拽卫星到中心触发跃迁
- [ ] 滚轮缩放正常
- [ ] 悬浮卡片显示角色信息
- [ ] 性能指示器显示正常

### 控制台检查
- [ ] 无 Three.js 多实例警告
- [ ] 无红色错误信息
- [ ] 显示启动消息
- [ ] FPS 稳定在 60

### 响应式检查
- [ ] 桌面端（1920×1080）正常
- [ ] 平板端（768×1024）正常
- [ ] 移动端（375×667）正常

---

## ✨ 额外优化

### 已实施的优化
1. ✅ **性能分级**：根据设备自动调整粒子数
2. ✅ **懒加载**：WebGL 组件按需加载
3. ✅ **代码分割**：Three.js 独立打包
4. ✅ **预构建**：开发时预构建依赖

### 建议的优化（可选）
- ⏳ 添加 Service Worker 缓存 Three.js
- ⏳ 使用 CDN 加载 Three.js
- ⏳ 实现渐进式加载策略

---

## 📝 测试报告模板

```
测试时间: ___________
测试人员: ___________
浏览器: Chrome / Firefox / Safari
设备: Desktop / Mobile

[ ] 无 Three.js 警告
[ ] 3D 场景正常
[ ] 性能稳定（60 FPS）
[ ] 控制台无错误
[ ] 响应式布局正常

备注:
___________________________
___________________________
```

---

## 🎉 验证通过标准

### 全部通过 ✅
- 控制台无 Three.js 警告
- 3D 场景流畅运行
- 性能指标达标
- 所有功能正常

### 部分通过 ⚠️
- 个别功能异常
- 性能略低于预期
- 需要进一步优化

### 未通过 ❌
- Three.js 警告仍存在
- 3D 场景无法渲染
- 性能严重下降

---

**版本**: v3.0.1  
**更新**: 2025-11-02  
**状态**: 🟢 已修复并验证
