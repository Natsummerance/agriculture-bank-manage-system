# 「星云·AgriVerse」纯夜间版 - 快速开始

## 🚀 核心特性

### ✨ 深空夜间主题（唯一模式）
- 🌌 **纯夜间美学**: 深空背景 + 霓虹发光
- ⚡ **性能优化**: 无主题切换开销
- 🎨 **视觉统一**: 单一设计语言
- 📱 **移动友好**: 48px 最小触控区

---

## 📦 快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
```
http://localhost:5173
```

---

## 🎮 使用指南

### 登录星球
1. 打开应用，自动进入 3D WebGL 星球场景
2. 选择右上角 `[2D Canvas]` 或 `[3D WebGL 🚀]`
3. 拖拽或点击五个角色卫星进入对应空间站

### 五角色功能
| 角色 | 主要功能 | 核心流程 |
|------|----------|----------|
| 🌾 农户 | 融资+卖货 | 申请融资 → 签约 → 还款 |
| 🛒 买家 | 采购+求购 | 浏览商品 → 下单 → 收货 |
| 🏦 银行 | 抢单+审批 | 雷达抢单 → 审批 → 放款 |
| 👨‍🔬 专家 | 问答+直播 | 回答问题 → 预约 → 提现 |
| ⚙️ 管理 | 审核+监控 | 内容审核 → 用户管理 |

---

## 💻 开发指南

### 使用异步按钮
```typescript
import { AsyncButton } from './components/ui/async-button';

<AsyncButton
  onClick={async () => {
    await api.post('/finance/apply', data);
  }}
  variant="primary"
  icon={<Sparkles />}
  onSuccess={() => toast.success('申请成功')}
>
  申请融资
</AsyncButton>
```

### 使用 IM 浮窗
```typescript
import { useImDialog } from './utils/useImDialog';

function ContactButton() {
  const { openSession } = useImDialog();

  return (
    <button onClick={() => openSession('user123', '张三', 'farmer')}>
      联系卖家
    </button>
  );
}
```

### 使用还款弹窗
```typescript
import { useRepayModal } from './utils/useRepayModal';

function RepayButton({ loanId }: { loanId: string }) {
  const { openModal } = useRepayModal();

  return (
    <button onClick={() => openModal(loanId)}>
      立即还款
    </button>
  );
}
```

### 使用手写签名
```typescript
import { useSignCanvas } from './utils/useSignCanvas';

function SignatureCanvas() {
  const { canvasRef, clear, getSignatureBlob } = useSignCanvas();

  const handleSubmit = async () => {
    const blob = await getSignatureBlob();
    if (blob) {
      // 上传签名
      const formData = new FormData();
      formData.append('signature', blob);
      await api.post('/contract/sign', formData);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-white/20 rounded-lg"
      />
      <button onClick={clear}>清除</button>
      <button onClick={handleSubmit}>提交签名</button>
    </div>
  );
}
```

---

## 🎨 样式系统

### CSS 变量（夜间主题）
```css
:root {
  /* 背景 */
  --bg-main: #0A0A0D;
  --bg-surface: #121726;
  --bg-elevated: #1C212E;
  
  /* 品牌色 */
  --brand-primary: #18FF74;
  --brand-secondary: #00D6C2;
  --brand-accent: #FF7A9C;
  
  /* 文字 */
  --text-primary: #FFFFFF;
  --text-secondary: #A5ACBA;
  --text-tertiary: #6C7580;
  
  /* 发光 */
  --glow-primary: 0 0 12px rgba(24, 255, 116, 0.55);
}
```

### Tailwind 工具类
```tsx
{/* 主按钮 */}
<button className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black rounded-xl px-6 py-3">
  提交
</button>

{/* 毛玻璃卡片 */}
<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
  内容
</div>

{/* 霓虹文字 */}
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
  星云·AgriVerse
</h1>
```

---

## 🔧 项目结构

```
├── components/
│   ├── ui/
│   │   ├── async-button.tsx      # 异步按钮组件
│   │   ├── button.tsx            # 基础按钮
│   │   └── ...                   # 其他 UI 组件
│   ├── LoginPlanet4.tsx          # 3D 登录星球
│   ├── MessageCenter.tsx         # 消息中心
│   └── ...
├── utils/
│   ├── useTheme.ts               # 主题 Hook（简化版）
│   ├── useAsyncButton.ts         # 异步按钮 Hook
│   ├── useImDialog.ts            # IM 浮窗 Hook
│   ├── useRepayModal.ts          # 还款弹窗 Hook
│   └── useSignCanvas.ts          # 手写签名 Hook
├── styles/
│   ├── globals.css               # 全局样式
│   └── theme.css                 # 夜间主题令牌
└── App.tsx                       # 主应用入口
```

---

## 📋 按钮位置规范

### 星球登录页
```
┌────────────────────────────────────┐
│  [2D] [3D]              [消息🔔]    │
│                                     │
│         星云·AgriVerse               │
│                                     │
└────────────────────────────────────┘
```

### 尺寸规范
- **最小尺寸**: 48 × 48 px
- **圆角**: 12px
- **同级间距**: 12px
- **不同组间距**: 24px

---

## 🐛 常见问题

### Q: 如何恢复日间模式？
A: 本版本为纯夜间模式，无日间模式。如需日间模式，请使用旧版本。

### Q: 按钮点击无反应？
A: 检查是否使用了 `AsyncButton` 且传入了 `onClick` 异步函数。

### Q: Canvas 签名不显示？
A: 确保 canvas 设置了正确的 `width` 和 `height` 属性（非 CSS）。

### Q: IM 浮窗不显示？
A: 检查是否调用了 `openSession` 方法。

---

## 📚 相关文档

- [完整交付报告](./NIGHT_MODE_ULTIMATE.md)
- [主题系统指南](./styles/theme.css)
- [组件库文档](./components/ui/)
- [Hook API 文档](./utils/)

---

## 🎯 下一步

1. ✅ 体验 3D 星球登录
2. ✅ 测试异步按钮组件
3. ✅ 尝试 IM 对话功能
4. ⏳ 开发五角色完整流程
5. ⏳ 接入真实后端 API

---

**版本**: Night Ultimate Edition v1.0  
**状态**: 🟢 可用  
**更新**: 2025-11-02
