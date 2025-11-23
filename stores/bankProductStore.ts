import { create } from 'zustand';

export interface BankLoanProduct {
  id: string;
  name: string;
  rate: number; // 年利率
  minAmount: number;
  maxAmount: number;
  termMonths: number; // 期限（月）
}

interface BankProductState {
  products: BankLoanProduct[];
  addProduct: (p: Omit<BankLoanProduct, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Omit<BankLoanProduct, 'id'>>) => void;
  removeProduct: (id: string) => void;
}

export const useBankProductStore = create<BankProductState>((set) => ({
  products: [],
  addProduct: (p) =>
    set((state) => ({
      products: [
        {
          ...p,
          id: `bp_${Date.now()}`,
        },
        ...state.products,
      ],
    })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));


