import { create } from 'zustand';

export interface FarmerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  status: 'on' | 'off';
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  description?: string;
}

interface FarmerProductState {
  products: FarmerProduct[];
  addProduct: (p: Omit<FarmerProduct, 'id' | 'status' | 'viewCount' | 'favoriteCount' | 'shareCount'>) => void;
  updateProduct: (id: string, patch: Partial<FarmerProduct>) => void;
  toggleStatus: (id: string) => void;
}

export const useFarmerProductStore = create<FarmerProductState>((set) => ({
  products: [],
  addProduct: (p) =>
    set((state) => ({
      products: [
        {
          ...p,
          id: `fp_${Date.now()}`,
          status: 'on',
          viewCount: 0,
          favoriteCount: 0,
          shareCount: 0,
        },
        ...state.products,
      ],
    })),
  updateProduct: (id, patch) =>
    set((state) => ({
      products: state.products.map((prod) =>
        prod.id === id ? { ...prod, ...patch } : prod
      ),
    })),
  toggleStatus: (id) =>
    set((state) => ({
      products: state.products.map((prod) =>
        prod.id === id
          ? { ...prod, status: prod.status === 'on' ? 'off' : 'on' }
          : prod
      ),
    })),
}));


