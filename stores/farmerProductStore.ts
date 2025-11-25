import { create } from 'zustand';
import {
  createFarmerProduct,
  getFarmerProducts,
  toggleProductStatus,
  type FarmerProduct,
  type ProductListParams,
  type CreateProductRequest,
} from '../api/farmer';

interface FarmerProductState {
  products: FarmerProduct[];
  loading: boolean;
  initialized: boolean;
  error?: string;
  fetchProducts: (params?: ProductListParams) => Promise<void>;
  addProduct: (payload: CreateProductRequest) => Promise<FarmerProduct>;
  toggleStatus: (id: string) => Promise<'on' | 'off'>;
}

export const useFarmerProductStore = create<FarmerProductState>((set, get) => ({
  products: [],
  loading: false,
  initialized: false,
  error: undefined,
  fetchProducts: async (params) => {
    set({ loading: true });
    try {
      const response = await getFarmerProducts(params);
      set({
        products: response.products,
        loading: false,
        initialized: true,
        error: undefined,
      });
    } catch (error: any) {
      const message = error?.message || '获取商品列表失败';
      set({ loading: false, error: message, initialized: true });
      throw error;
    }
  },
  addProduct: async (payload) => {
    const product = await createFarmerProduct(payload);
    set((state) => ({
      products: [product, ...state.products],
      initialized: true,
    }));
    return product;
  },
  toggleStatus: async (id) => {
    const product = get().products.find((item) => item.id === id);
    if (!product) {
      throw new Error('未找到商品');
    }
    const nextStatus: 'on' | 'off' = product.status === 'on' ? 'off' : 'on';
    await toggleProductStatus({ productId: id, status: nextStatus });
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    }));
    return nextStatus;
  },
}));

