## AgriVerse 前端视觉与交互动效风格指南（FLAVOUR）

> 本文用于约束和统一「星云之门 / 星球登录 / 多角色工作台」的视觉与交互风格。新增页面或组件必须参照本文件，避免跑偏整体调性。

---

## 1. 整体视觉基调

- **主题关键词**：宇宙、量子、星云、金融科技、农业绿色
- **背景基色**：
  - 深色宇宙背景：`#050816` / `#0A0F1E`
  - 页面容器一般不使用纯黑，而是带轻微蓝偏（如 `#0A0F1E`）
- **主色 / 高亮色**：
  - 农业金融主色：`#00D6C2`（青绿） + `#18FF74`（荧光绿） 渐变
  - 辅助高亮：`#FF2566`（粉红），`#FFD700`（金色）
- **常用渐变**：
  - 主按钮 / 强 CTA：
    - `bg-gradient-to-r from-[#00D6C2] to-[#18FF74]`
  - 标签 / 徽章：
    - `from-[#00D6C2]/20 to-[#18FF74]/20`
  - 金融/评分相关：
    - `from-[#FFD700] to-[#FF8C00]`

---

## 2. 布局与间距规范

- **页面结构**：
  - 顶部固定导航栏（`Navigation`），玻璃态、带 Logo 与 Tab。
  - 主体区域最大宽度：`max-w-7xl mx-auto`
  - 水平内边距：`px-6`
  - 顶部内边距：`pt-24`（为顶部导航留出空间）
  - 底部间距：`pb-12` 或根据内容增加
- **区块划分**：
  - 页面内按照「Section / 卡片」组织：
    - Section 标题行带左侧竖条：`w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full`
    - 标题使用 `h3/h4`，右侧可以补充说明文字（`text-white/40`）
- **卡片间距**：
  - Section 间距：`space-y-8` / `mb-8 ~ mb-12`
  - 卡片内边距：`p-6` 或 `p-8`

---

## 3. Glassmorphism（玻璃拟态）与边框

- **玻璃态容器**（通用类名）：
  - 背景：`bg-white/5` 或 `bg-[#0A0F1E]/80`
  - 边框：`border border-white/10` 或 `border-2 border-[#00D6C2]/30`
  - 圆角：`rounded-2xl` 或 `rounded-xl`
  - 模糊：在需要时加 `backdrop-blur-xl`
- 统一使用现有样式命名（若存在）：
  - `glass-morphism`：已在多处组件中复用，新增卡片尽量沿用。
- **高亮卡片**：
  - 边框颜色强化（如：`border-[#18FF74]/50`）
  - 背景加轻雾渐变：`from-[#00D6C2]/10 to-[#18FF74]/10`

---

## 4. 字体与文字风格

- **字体大小层级**（Tailwind 默认基础上）：
  - 页面主标题：`text-2xl` ~ `text-3xl`，常配渐变文字
  - Section 标题：`text-lg` ~ `text-xl`
  - 正文：`text-sm` ~ `text-base`
  - 次要文案 / Tag：`text-xs`
- **颜色层级**：
  - 主要文字：`text-white`
  - 次要说明：`text-white/60`
  - 弱提示 / 辅助：`text-white/40`
- **渐变文字用法**：
  - 主标题常用：
    - `text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]`

---

## 5. 图标与图形语言

- 图标统一使用 `lucide-react`：
  - 金融：`DollarSign`, `CreditCard`, `TrendingUp`
  - 角色：`User`, `Users`, `Building2`, `Shield`
  - 导航：`Home`, `ShoppingCart`, `Bell`
  - 操作：`Settings`, `Edit`, `Trash2`, `Plus`
- 图标尺寸：
  - 导航栏图标：`w-4 h-4` 或 `w-5 h-5`
  - 卡片主要图标：`w-6 h-6` ~ `w-8 h-8`
- 颜色：
  - 使用对应主色（如金融用 `#00D6C2`，收入/奖励用 `#FFD700`）

---

## 6. 动效与交互行为规范

### 6.1 通用 Motion 交互

- 使用 `motion/react` 实现：
  - 悬浮缩放：`whileHover={{ scale: 1.05 }}` / `whileTap={{ scale: 0.95 }}`
  - 进入动画：
    - 淡入上移：`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
    - 淡入下移：`initial={{ opacity: 0, y: -20 }} ...`
  - 循环呼吸：
    - `animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }}`

### 6.2 导航栏动效

- 顶部 `Navigation`：
  - 整体下滑出现：`initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}`
  - 选中 Tab 高亮块：
    - 使用 `layoutId="activeTab"` 共享布局，形成平滑滑块效果
    - 背景：`bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20`
    - 阴影：`boxShadow: '0 0 20px rgba(0, 214, 194, 0.3)'`

### 6.3 徽章 / Badge 动效

- 未读消息 / 购物车角标：
  - 初始弹出：`initial={{ scale: 0 }} animate={{ scale: 1 }}`
  - 心跳动画（未读小红点）：
    - `animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity }}`

### 6.4 列表与卡片

- Section 内列表（如产品列表、专家列表、问答列表）：
  - 进入时带延迟 Stagger：
    - `transition={{ delay: index * 0.1 }}` 或 `0.05`
  - 悬浮抬升：`whileHover={{ y: -4 }}` 或 `y: -8`

### 6.5 特殊动画组件（必须遵循的具体模式）

#### 6.5.1 星球 / WebGL 场景

- 组件：`WebGLSphere`, `HeatmapSphere`, `LoginPlanet4` 等。
- 旋转与相机：
  - 默认保持**低速自动旋转**，避免眩晕：
    - 原始设计速度基础上统一降低（如 `speed * 0.1` 已在 `LoginPlanet4` 中实现）。
  - 旋转方向与节奏要缓慢、连续，不要急促来回抖动。
- 粒子 / 卫星：
  - 卫星围绕行星旋转时使用平滑的 `sin/cos` 插值，不使用突变位移。
  - 多个卫星速度略有差异，增强层次感，但同一组内速度差不要过大。
- 技术约束：
  - 所有 three.js 场景必须在 `suppress-three-warning` 注入后再初始化，以保持控制台干净。

#### 6.5.2 3D 日历翻转（ExpertPage 预约日历）

- 使用 `rotateY` 实现月份切换的「翻面」效果：
  - 时长：约 `0.6s`
  - Easing：`easeInOut` 类型，前后缓动。
  - 翻转时禁用交互，避免中途点击导致状态错乱。

#### 6.5.3 知识星系（ExpertPage 专家星云）

- 专家头像卡片：
  - 初次进入：
    - `initial={{ opacity: 0, scale: 0, rotate: -180 }}`
    - `animate={{ opacity: 1, scale: 1, rotate: 0 }}`
    - 使用 `spring`，增加宇宙“出现”感。
  - 悬浮：
    - `whileHover={{ scale: 1.1, rotate: 5 }}`，有轻微旋转但不过度。
  - 选中状态：
    - 选中的专家卡片可 `y: -8`，表现为被高亮选中。

- 在线状态呼吸灯：
  - 小圆点位置：卡片右上角。
  - 动画：
    - `animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}`
  - 颜色：在线为 `#18FF74`，并带 `box-shadow: '0 0 12px #18FF74'`。

- 虫洞 / 详情浮层：
  - 选中某个专家时，卡片中央浮现「虫洞」图标（如 `Video` 图标）：
    - `initial={{ scale: 0, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}`
    - 覆盖在卡片中央但保持半透明渐变背景。

#### 6.5.4 知识问答列表（热门问答）

- 问答列表项进入：
  - `initial={{ opacity: 0, x: -20 }}`
  - `animate={{ opacity: 1, x: 0 }}`，配合 `delay: index * 0.1`。
- 悬浮行为：
  - `whileHover={{ x: 4 }}`，轻微水平位移，模拟「滑动查看」的感觉。
- 点赞按钮：
  - `whileHover={{ scale: 1.05 }}`，点击可后续扩展为缩放 + 数字弹跳。

#### 6.5.5 金融匹配网络（FinancePage 智能匹配节点）

- 连线动画：
  - 使用 `motion.line`，从 `pathLength: 0` 渐变到 `1`，时长约 `1.5s`。
  - 不同线条按节点索引延迟（`delay: i * 0.1`），形成逐步点亮效果。
- 节点动画：
  - 初始：`initial={{ scale: 0, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}`。
  - 呼吸与发光：
    - `animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 0px ...', '0 0 20px ...', '0 0 0px ...'] }}`
    - 颜色根据节点类型切换（农户/银行/买家）。
  - 悬停信息卡片：
    - 悬停节点时，下方/旁边弹出透明玻璃卡片，显示名称与相似度。

#### 6.5.6 实时供需地图（HomePage 供需脉冲）

- 背景路径使用 SVG 曲线，整体低透明度。
- 脉冲点：
  - 多个圆点随机分布：`left / top` 为百分比随机值。
  - 动画：`scale: [1, 1.5, 1]` + `opacity: [1, 0.5, 1]`，时长 ~1.2s，错峰延迟。
  - 外环扩散：内圈小点 + 外圈 stroke 扩散消失，重复循环。

#### 6.5.7 下单成功 / 结果页（Checkout 成功页等）

- 成功图标（如 `Check`）：
  - 初始缩放：`initial={{ scale: 0 }} animate={{ scale: 1 }}` 使用 `spring`。
  - 背景光圈：
    - 外圈使用模糊的绿色/渐变圆形，做缓慢呼吸放大：`scale: [1, 1.2, 1]`。


---

## 7. 各角色风格微调（在统一基调下的偏好）

> 所有角色共用同一套“宇宙+金融科技”风格，只在细节色彩与图标上略做区分。

- **农户（farmer）**
  - 主色偏绿色：`#18FF74`
  - 图标常用：🌾、农田、植物等 Emoji 或图形
  - 卡片可突出「订单金额、产量、认证」等信息

- **买家（buyer）**
  - 主色偏青色：`#00D6C2`
  - 购物/订单相关图标使用 `ShoppingCart`, `Package`
  - 价格信息强调对比价、折扣、优惠券

- **银行（bank）**
  - 金色 + 橙色点缀：`#FFD700`, `#FF8C00`
  - 多使用雷达、图表、盾牌等金融/风控图标

- **专家（expert）**
  - 紫色/粉色：`#A78BFA`, `#FF6B9D`
  - 知识/内容模块强调卡片式展示 + 评分

- **管理员（admin）**
  - 较中性的紫红与灰：`#9D4EDD`, `#FF6B9D`
  - 突出监控、开关、表格、日志等元素

---

## 8. 新页面开发 Checklist

新增页面 / 模块时，务必对照以下清单：

1. **背景与布局**
   - 是否使用深色宇宙背景（`#050816` / `#0A0F1E`）？
   - 是否使用 `max-w-7xl mx-auto px-6 pt-24` 作为基础布局？
2. **卡片与样式**
   - 是否使用 `glass-morphism` 风格？边框、圆角是否统一？
   - 颜色是否使用主渐变 `from-[#00D6C2] to-[#18FF74]` 或文档中推荐的几组？
3. **文字与图标**
   - 标题是否带左侧渐变竖条？
   - 文案层级（`text-white / text-white/60 / text-white/40`）是否清晰？
   - 图标是否使用 `lucide-react`，风格匹配？
4. **动效**
   - 按钮是否有轻微的 `whileHover` / `whileTap` 动画？
   - 列表项是否有平滑的进入动画和悬浮抬升？
5. **角色差异**
   - 若页面受角色影响，是否通过 `useRole().role` 做了轻量差异展示（颜色/标签/文案）？
6. **导航集成**
   - 若是顶层模块，是否已经通过 `DESIGN.md` 约定的映射接入到 `StarGateApp` 或对应 `/role/*` 路由？

---

> 规范约定：后续设计与开发若有视觉或交互上的重大变化，必须先更新 **FLAVOUR.md**（风格）与 **DESIGN.md**（结构），再进行编码。任何偏离本指南的视觉风格变更，需要有明确的“升级说明”和全局评估。 


