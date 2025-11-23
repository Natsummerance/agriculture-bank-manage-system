import { create } from 'zustand';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  origin: string;
  selected: boolean;
}

interface CartState {
  items: CartItem[];
  count: number;
  totalAmount: number;
  
  // Actions
  add: (product: Omit<CartItem, 'id' | 'selected'>) => void;
  remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelect: (id: string) => void;
  selectAll: (selected: boolean) => void;
  clearSelected: () => void;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  totalAmount: 0,

  add: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.productId === product.productId);
    
    if (existingItem) {
      // 更新数量
      set({
        items: items.map(item => 
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + product.quantity, item.stock) }
            : item
        ),
      });
      toast.success('已更新购物车数量');
    } else {
      // 添加新商品
      const newItem: CartItem = {
        ...product,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        selected: true,
      };
      set({ items: [...items, newItem] });
      toast.success('已加入购物车');
    }
    
    // 更新计数和总额
    const updatedItems = get().items;
    set({
      count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: updatedItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
  },

  remove: (id) => {
    const items = get().items.filter(item => item.id !== id);
    set({ 
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
    toast.success('已移除商品');
  },

  updateQuantity: (id, quantity) => {
    const items = get().items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
        : item
    );
    set({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
  },

  toggleSelect: (id) => {
    const items = get().items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    set({
      items,
      totalAmount: items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
  },

  selectAll: (selected) => {
    const items = get().items.map(item => ({ ...item, selected }));
    set({
      items,
      totalAmount: selected
        ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        : 0,
    });
  },

  clearSelected: () => {
    const items = get().items.filter(item => !item.selected);
    set({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: 0,
    });
  },

  checkout: async () => {
    const selectedItems = get().items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error('请选择要结算的商品');
      return;
    }
    
    // Mock API call
    toast.success('正在前往结算...');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 实际应用中这里会跳转到结算页面
    // 暂时清空已选商品
    get().clearSelected();
  },
}));
