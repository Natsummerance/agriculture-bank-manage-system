import { create } from 'zustand';
import { DateRange } from 'react-day-picker';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'to-ship'
  | 'shipped'
  | 'completed'
  | 'refunding'
  | 'refunded'
  | 'cancelled';

export interface BuyerOrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type RefundStatus =
  | 'pending'      // 买家已申请，待卖家处理
  | 'approved'     // 卖家同意退款，待平台/资金处理
  | 'rejected'     // 卖家拒绝退款，可升级仲裁
  | 'escalated'    // 买家已申请平台仲裁
  | 'success'      // 平台判定退款成功
  | 'failed';      // 平台判定退款失败

export interface RefundHistoryItem {
  action: string;
  actor: 'buyer' | 'farmer' | 'admin';
  note?: string;
  at: string;
}

export interface BuyerOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: BuyerOrderItem[];
  totalAmount: number;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  refundReason?: string;
  refundStatus?: RefundStatus;
  refundHistory?: RefundHistoryItem[];
}

interface BuyerOrderState {
  orders: BuyerOrder[];
  filterStatus: OrderStatus | 'all';
  dateRange?: DateRange;
  createOrderFromCart: (items: BuyerOrderItem[]) => BuyerOrder | null;
  updateStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, patch: Partial<BuyerOrder>) => void;
  setRefundStatus: (id: string, status: RefundStatus) => void;
  appendRefundHistory: (id: string, item: RefundHistoryItem) => void;
  setFilterStatus: (status: OrderStatus | 'all') => void;
  setDateRange: (range?: DateRange) => void;
}

export const useBuyerOrderStore = create<BuyerOrderState>((set, get) => ({
  orders: [],
  filterStatus: 'all',
  dateRange: undefined,

  createOrderFromCart: (items) => {
    if (!items.length) return null;
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order: BuyerOrder = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      items,
      totalAmount,
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },

  updateStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },

  updateOrder: (id, patch) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  },

  setRefundStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, refundStatus: status } : o,
      ),
    }));
  },

  appendRefundHistory: (id, item) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              refundHistory: [...(o.refundHistory ?? []), item],
            }
          : o,
      ),
    }));
  },

  setFilterStatus: (status) => set({ filterStatus: status }),

  setDateRange: (range) => set({ dateRange: range }),
}));



