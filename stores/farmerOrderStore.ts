import { create } from 'zustand';

export type FarmerOrderStatus = 'to-ship' | 'shipped' | 'completed';

export interface FarmerOrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface FarmerOrder {
  id: string;
  buyerName: string;
  status: FarmerOrderStatus;
  items: FarmerOrderItem[];
  totalAmount: number;
  shippingCompany?: string;
  trackingNumber?: string;
}

interface FarmerOrderState {
  orders: FarmerOrder[];
  updateOrder: (id: string, patch: Partial<FarmerOrder>) => void;
  updateStatus: (id: string, status: FarmerOrderStatus) => void;
}

export const useFarmerOrderStore = create<FarmerOrderState>((set) => ({
  orders: [],
  updateOrder: (id, patch) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));


