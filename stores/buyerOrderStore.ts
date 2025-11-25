import { create } from 'zustand';
import { DateRange } from 'react-day-picker';
import { getBuyerOrders, updateBuyerOrderStatus, cancelBuyerOrder, type BuyerOrder as ApiBuyerOrder } from '../api/buyer';
import { toast } from 'sonner';

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
  loading: boolean;
  page: number;
  total: number;
  loadOrders: (status?: string, page?: number) => Promise<void>;
  createOrderFromCart: (items: BuyerOrderItem[]) => BuyerOrder | null;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  updateOrder: (id: string, patch: Partial<BuyerOrder>) => void;
  setRefundStatus: (id: string, status: RefundStatus) => void;
  appendRefundHistory: (id: string, item: RefundHistoryItem) => void;
  setFilterStatus: (status: OrderStatus | 'all') => void;
  setDateRange: (range?: DateRange) => void;
}

// 将API返回的订单转换为store中的订单格式
const convertApiOrderToStoreOrder = (apiOrder: ApiBuyerOrder): BuyerOrder => {
  return {
    id: apiOrder.id,
    createdAt: apiOrder.createdAt,
    status: apiOrder.status as OrderStatus,
    items: apiOrder.items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.productImage,
    })),
    totalAmount: apiOrder.totalAmount,
    shippingName: apiOrder.shippingName,
    shippingPhone: apiOrder.shippingPhone,
    shippingAddress: apiOrder.shippingAddress,
    paymentMethod: apiOrder.paymentMethod,
    refundReason: apiOrder.refundReason,
    refundStatus: apiOrder.refundStatus as RefundStatus | undefined,
    refundHistory: undefined, // API暂无此字段
  };
};

export const useBuyerOrderStore = create<BuyerOrderState>((set, get) => ({
  orders: [],
  filterStatus: 'all',
  dateRange: undefined,
  loading: false,
  page: 1,
  total: 0,

  loadOrders: async (status = 'all', page = 1) => {
    try {
      set({ loading: true });
      const response = await getBuyerOrders({
        status: status !== 'all' ? status : undefined,
        page,
        pageSize: 20,
      });
      
      const orders = response.orders.map(convertApiOrderToStoreOrder);
      set({ 
        orders, 
        total: response.total, 
        page: response.page,
        loading: false 
      });
    } catch (error: any) {
      console.error('加载订单列表失败:', error);
      toast.error(error.message || '加载订单列表失败');
      set({ loading: false });
    }
  },

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

  updateStatus: async (id, status) => {
    try {
      await updateBuyerOrderStatus(id, { status });
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));
      toast.success('订单状态已更新');
    } catch (error: any) {
      console.error('更新订单状态失败:', error);
      toast.error(error.message || '更新订单状态失败');
      throw error;
    }
  },

  cancelOrder: async (id) => {
    try {
      await cancelBuyerOrder(id);
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === id ? { ...o, status: 'cancelled' as OrderStatus } : o
        ),
      }));
      toast.success('订单已取消');
    } catch (error: any) {
      console.error('取消订单失败:', error);
      toast.error(error.message || '取消订单失败');
      throw error;
    }
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



