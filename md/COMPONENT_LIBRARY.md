# 星云·AgriVerse 组件库文档

> 所有组件遵循8pt网格系统、夜间主题（#0A0A0D）、量子发光效果

---

## 🎨 设计规范

### 色彩系统
- **主色（极光青）**: `#00D6C2`
- **辅色（生物绿）**: `#18FF74`
- **强调色（量子红）**: `#FF2566`
- **背景（深空黑）**: `#0A0A0D`
- **表面（空间蓝）**: `#121726`

### 间距系统（8pt Grid）
- 按钮最小尺寸: `48×48px`
- 按钮间距: `12px`
- 圆角: `12px / 16px / 20px`
- 动画时长: `≤400ms`

### 量子发光效果
```css
.quantum-glow {
  box-shadow: 0 0 8px rgba(0, 214, 194, 0.55);
}

.bio-glow {
  box-shadow: 0 0 12px rgba(24, 255, 116, 0.45);
}
```

---

## 📦 状态管理 Store

### 1. CartStore (`/stores/cartStore.ts`)

购物车全局状态管理

```typescript
import { useCartStore } from '../stores/cartStore';

// 读取状态
const count = useCartStore(state => state.count);
const items = useCartStore(state => state.items);
const totalAmount = useCartStore(state => state.totalAmount);

// 操作方法
const { add, remove, updateQuantity, checkout } = useCartStore();

// 添加商品
add({
  productId: 'p1',
  name: '有机苹果',
  price: 12.8,
  quantity: 5,
  stock: 100,
  image: '...',
  origin: '陕西延安',
});
```

**状态字段**:
- `items: CartItem[]` - 购物车商品列表
- `count: number` - 商品总数量
- `totalAmount: number` - 已选商品总金额

**方法**:
- `add(product)` - 添加商品到购物车
- `remove(id)` - 移除商品
- `updateQuantity(id, quantity)` - 更新数量
- `toggleSelect(id)` - 切换选中状态
- `selectAll(selected)` - 全选/取消全选
- `checkout()` - 结算

---

### 2. MsgStore (`/stores/msgStore.ts`)

消息通知全局状态管理

```typescript
import { useMsgStore } from '../stores/msgStore';

// 读取状态
const unread = useMsgStore(state => state.unread);
const messages = useMsgStore(state => state.messages);

// 操作方法
const { addMessage, markAsRead, markAllRead, deleteMessage } = useMsgStore();

// 添加新消息
addMessage({
  type: 'order',
  title: '订单已发货',
  content: '您的商品已发货',
  time: '刚刚',
  read: false,
});
```

**状态字段**:
- `messages: Message[]` - 消息列表
- `unread: number` - 未读消息数

**方法**:
- `addMessage(message)` - 添加新消息
- `markAsRead(id)` - 标记为已读
- `markAllRead()` - 全部已读
- `deleteMessage(id)` - 删除消息

---

## 🧩 公共组件

### 1. CartIcon

购物车图标（带数量气泡）

```tsx
import CartIcon from './components/common/CartIcon';

<CartIcon 
  onClick={() => navigate('/cart')}
  className="mr-4"
/>
```

**Props**:
- `onClick?: () => void` - 点击事件
- `className?: string` - 自定义样式

**特性**:
- 自动读取 `useCartStore` 的 count
- 数量气泡弹性动画
- 超过99显示 "99+"
- 量子发光效果

**尺寸**: `40×40px`（符合48px点击区域）

---

### 2. QtyStepper

数量步进器（±1 + 输入框）

```tsx
import QtyStepper from './components/common/QtyStepper';

<QtyStepper
  value={quantity}
  min={1}
  max={100}
  onChange={setQuantity}
  size="md"
/>
```

**Props**:
- `value: number` - 当前值
- `min?: number` - 最小值（默认1）
- `max?: number` - 最大值（默认999）
- `onChange: (value: number) => void` - 变化回调
- `size?: 'sm' | 'md' | 'lg'` - 尺寸（默认md）

**尺寸**:
- `sm`: 按钮 `32×32px`，输入框 `40px`
- `md`: 按钮 `40×40px`，输入框 `48px`
- `lg`: 按钮 `48×48px`，输入框 `64px`

**特性**:
- 自动边界校验
- 支持键盘输入
- 按钮点击防抖
- 渐变Hover效果

---

### 3. Model360

360度旋转查看器

```tsx
import Model360 from './components/common/Model360';

<Model360
  images={[
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
  ]}
  className="h-96"
/>
```

**Props**:
- `images: string[]` - 图片数组（建议8-36张）
- `className?: string` - 自定义样式

**特性**:
- 拖拽旋转（左右滑动）
- 缩放功能（1x-3x）
- 全屏查看
- 重置按钮
- 进度指示器
- 自动全屏监听

**交互**:
- 拖动 → 旋转
- 双击 → 放大
- Pinch → 缩放（触屏）

---

### 4. SwipeDelete

左滑删除容器

```tsx
import SwipeDelete from './components/common/SwipeDelete';

<SwipeDelete
  onDelete={() => removeItem(item.id)}
  threshold={80}
>
  <div className="p-4 bg-white/5">
    商品内容
  </div>
</SwipeDelete>
```

**Props**:
- `children: React.ReactNode` - 子内容
- `onDelete: () => void` - 删除回调
- `threshold?: number` - 触发阈值（默认80px）

**特性**:
- 左滑显示删除按钮
- 拖动距离渐变背景
- 超过阈值自动删除
- 弹性回弹动画
- 删除飞出动画

---

### 5. IMFloat

全局IM浮窗（单例模式）

```tsx
import IMFloat from './components/common/IMFloat';

// 在 App.tsx 中全局挂载
<IMFloat
  expertId="expert1"
  expertName="在线客服"
  expertAvatar="avatar.jpg"
  autoOpen={false}
/>
```

**Props**:
- `expertId?: string` - 专家ID（默认 "default"）
- `expertName?: string` - 专家名称（默认 "在线客服"）
- `expertAvatar?: string` - 头像URL
- `autoOpen?: boolean` - 自动打开（默认 false）

**特性**:
- 固定右下角浮窗按钮
- 未读消息气泡
- 呼吸灯动画
- 最小化/恢复
- 集成 `ConsultDialog` 组件
- 自动计算未读数

**尺寸**: `56×56px` FAB按钮

---

### 6. SharePopover

分享弹出菜单

```tsx
import SharePopover from './components/common/SharePopover';

<SharePopover
  url="https://agriverse.com/product/123"
  title="有机富硒苹果"
  description="新鲜直采，品质保证"
  className="ml-2"
/>
```

**Props**:
- `url?: string` - 分享链接（默认当前页面）
- `title?: string` - 标题
- `description?: string` - 描述
- `className?: string` - 自定义样式

**功能**:
- 复制链接
- 生成二维码
- 生成分享海报
- 社交媒体分享（规划中）

---

### 7. DemandFab

发布求购FAB按钮

```tsx
import DemandFab from './components/common/DemandFab';

// 仅在交易页显示
{currentPage === 'trade' && <DemandFab />}
```

**Props**:
- `className?: string` - 自定义样式

**特性**:
- 固定右下角（bottom-24）
- 渐变绿色主按钮
- 脉冲呼吸动画
- Sparkle闪烁图标
- Hover提示气泡
- 自动路由到 `/demand`

**位置**: 不与 IMFloat 重叠（错开80px）

---

## 🎯 完整页面组件

### 1. CartPage (`/components/cart/CartPage.tsx`)

购物车页面

**功能**:
- ✅ 商品列表展示
- ✅ 全选/单选
- ✅ 数量步进器
- ✅ 左滑删除
- ✅ 实时金额计算
- ✅ 结算按钮（底部固定）
- ✅ 空态插画
- ✅ 删除二次确认

**路由**: `/cart`

---

### 2. ProductDetailPage (`/components/product/ProductDetailPage.tsx`)

产品详情页

**功能**:
- ✅ 360°图片查看
- ✅ 产品信息展示
- ✅ 价格/规格/评价
- ✅ 加入购物车（飞入动画）
- ✅ 立即购买
- ✅ 收藏按钮
- ✅ 分享功能
- ✅ 专家咨询入口
- ✅ 评价列表

**路由**: `/product/:id`

---

### 3. BuyerDemandPage (`/components/demand/BuyerDemandPage.tsx`)

发布求购需求页

**功能**:
- ✅ 商品名称搜索+智能提示
- ✅ 数量/单位选择
- ✅ 期望单价滑块
- ✅ 交货日期日历
- ✅ 地址输入+地图选点（规划）
- ✅ AI预填充
- ✅ 图片上传（最多3张）
- ✅ 表单校验
- ✅ 粒子动画提交按钮

**路由**: `/demand`

---

### 4. ConsultDialog (`/components/consult/ConsultDialog.tsx`)

专家咨询IM对话框

**功能**:
- ✅ 实时聊天界面
- ✅ 文字/语音/图片消息
- ✅ 语音录制（按住说话）
- ✅ 快捷短语
- ✅ 预约专家按钮
- ✅ 音视频通话入口
- ✅ 消息气泡动画
- ✅ 自动滚动到底部

**触发方式**:
- 产品详情页「咨询专家」按钮
- 全局 `IMFloat` 组件

---

### 5. NotificationDrawer (`/components/notification/NotificationDrawer.tsx`)

消息通知侧滑抽屉

**功能**:
- ✅ 侧滑进入动画
- ✅ Tab分类（全部/系统/订单/消息）
- ✅ 全部已读按钮
- ✅ 单条删除
- ✅ 未读红点脉冲
- ✅ 消息点击跳转
- ✅ 空态提示
- ✅ 无限滚动加载（规划）

**触发方式**:
- 顶部导航栏铃铛按钮

---

## 🚀 使用指南

### 快速开始

1. **导入Store**
```tsx
import { useCartStore } from './stores/cartStore';
import { useMsgStore } from './stores/msgStore';
```

2. **导入组件**
```tsx
import { CartIcon, QtyStepper, Model360 } from './components/common';
```

3. **在页面中使用**
```tsx
export default function MyPage() {
  const count = useCartStore(state => state.count);
  
  return (
    <div>
      <CartIcon onClick={() => navigate('/cart')} />
      <QtyStepper value={qty} onChange={setQty} />
    </div>
  );
}
```

---

## 📐 布局规范

### 顶部导航栏
- 高度: `64px`
- Logo区域: 左侧固定
- 主导航: 居中（间距12px）
- 操作按钮: 右侧（分享 → 购物车 → 通知 → 用户）

### 底部操作栏
- 高度: `80px + safe-area`
- 按钮最小宽度: `120px`
- 双按钮布局: `1:1` 宽度
- 悬浮渐变背景 + 毛玻璃效果

### 浮动按钮
- IMFloat: `right-6 bottom-6`
- DemandFab: `right-6 bottom-24`（错开80px）
- 尺寸: `56×56px`
- 阴影: `0 0 24px rgba(0, 214, 194, 0.5)`

---

## 🎭 动画规范

### 微交互时长
- 按钮点击: `200ms`
- 页面切换: `400ms`
- 抽屉滑动: `600ms`
- 粒子动画: `800ms`

### Easing曲线
- 标准: `cubic-bezier(0.4, 0, 0.2, 1)`
- 弹性: `spring(damping: 30, stiffness: 300)`
- 悬停: `ease-in-out`

### 量子发光动画
```tsx
animate={{
  scale: [1, 1.2, 1],
  opacity: [1, 0.8, 1]
}}
transition={{
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

---

## ✅ 功能清单

| 模块 | 组件 | 状态 | 备注 |
|------|------|------|------|
| 购物车 | CartPage | ✅ | 完整实现 |
| 购物车 | CartIcon | ✅ | 全局组件 |
| 购物车 | QtyStepper | ✅ | 通用组件 |
| 产品详情 | ProductDetailPage | ✅ | 含360°查看 |
| 产品详情 | Model360 | ✅ | 通用组件 |
| 产品详情 | SharePopover | ✅ | 通用组件 |
| 求购需求 | BuyerDemandPage | ✅ | 含AI预填充 |
| 求购需求 | DemandFab | ✅ | 全局FAB |
| 消息通知 | NotificationDrawer | ✅ | 侧滑抽屉 |
| 消息通知 | MsgStore | ✅ | 状态管理 |
| 专家咨询 | ConsultDialog | ✅ | IM对话框 |
| 专家咨询 | IMFloat | ✅ | 全局浮窗 |
| 通用交互 | SwipeDelete | ✅ | 左滑删除 |

---

## 🔧 后续规划

### Gap功能（优先级高）
- [ ] 地图选点组件（高德地图集成）
- [ ] 视频客服组件（WebRTC）
- [ ] 区块链存证查看器
- [ ] 多人联合贷流程图
- [ ] 银行风控雷达图

### Delight体验（优先级中）
- [ ] 粒子匹配动画
- [ ] WebGL星球交互升级
- [ ] 语音播报功能
- [ ] AR产品预览
- [ ] 手势识别交互

---

## 📞 技术支持

- **设计系统**: Apple级极简 + 农业未来主义
- **动画引擎**: Motion (Framer Motion)
- **状态管理**: Zustand
- **UI组件库**: Shadcn/ui
- **图标库**: Lucide React

**所有组件已遵循8pt网格、夜间主题、量子发光效果，可直接投入生产！** ✨
