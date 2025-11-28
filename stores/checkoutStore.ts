import { create } from 'zustand';
import { createBuyerOrder, type CreateOrderRequest } from '../api/buyer';
import { useCartStore } from './cartStore';

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface Coupon {
  id: string;
  name: string;
  discount: number;
  minAmount: number;
  type: 'percent' | 'fixed';
  expireDate: string;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
}

type PaymentMethod = 'alipay' | 'wechat' | 'bank' | 'agripay';

interface CheckoutStore {
  cartItems: CartItem[];
  selectedAddress: Address | null;
  selectedCoupon: Coupon | null;
  installmentEnabled: boolean;
  installmentMonths: number;
  paymentMethod: PaymentMethod;
  addresses: Address[];
  coupons: Coupon[];
  
  setSelectedAddress: (address: Address | null) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  toggleInstallment: () => void;
  setInstallmentMonths: (months: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  loadAddresses: () => void;
  loadCoupons: () => void;
  loadCartItems: () => void;
  calculateTotal: () => number;
  calculateDiscount: () => number;
  calculateFinalPrice: () => number;
  submitOrder: () => Promise<{ orderId: string; blockchainHash: string }>;
}

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  cartItems: [],
  selectedAddress: null,
  selectedCoupon: null,
  installmentEnabled: false,
  installmentMonths: 3,
  paymentMethod: 'alipay',
  addresses: [],
  coupons: [],

  setSelectedAddress: (address) => set({ selectedAddress: address }),

  setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),

  toggleInstallment: () => set((state) => ({ installmentEnabled: !state.installmentEnabled })),

  setInstallmentMonths: (months) => set({ installmentMonths: months }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  loadAddresses: () => {
    const mockAddresses: Address[] = [
      {
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '四川省',
        city: '成都市',
        district: '武侯区',
        detail: '天府大道中段1号',
        isDefault: true,
      },
      {
        id: '2',
        name: '李四',
        phone: '13900139000',
        province: '山东省',
        city: '济南市',
        district: '历下区',
        detail: '泉城路100号',
        isDefault: false,
      },
    ];
    set({ addresses: mockAddresses, selectedAddress: mockAddresses[0] });
  },

  loadCoupons: () => {
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        name: '新人专享券',
        discount: 20,
        minAmount: 100,
        type: 'fixed',
        expireDate: '2025-12-31',
      },
      {
        id: '2',
        name: '农产品满减券',
        discount: 10,
        minAmount: 200,
        type: 'percent',
        expireDate: '2025-11-30',
      },
      {
        id: '3',
        name: '限时优惠券',
        discount: 50,
        minAmount: 500,
        type: 'fixed',
        expireDate: '2025-11-15',
      },
    ];
    
    const total = get().calculateTotal();
    const availableCoupon = mockCoupons.find((c) => c.minAmount <= total);
    
    set({ coupons: mockCoupons, selectedCoupon: availableCoupon || null });
  },

  loadCartItems: () => {
    const mockItems: CartItem[] = [
      {
        id: '1',
        name: '有机番茄',
        image: 'https://images.unsplash.com/photo-1546470427-227bb44e2736?w=200',
        price: 28,
        quantity: 5,
        unit: 'kg',
      },
      {
        id: '2',
        name: '生态大米',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
        price: 45,
        quantity: 2,
        unit: 'kg',
      },
      {
        id: '3',
        name: '新鲜鸡蛋',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc1f3e3b78?w=200',
        price: 35,
        quantity: 3,
        unit: '盒',
      },
    ];
    set({ cartItems: mockItems });
  },

  calculateTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  calculateDiscount: () => {
    const { selectedCoupon } = get();
    if (!selectedCoupon) return 0;
    
    const total = get().calculateTotal();
    if (selectedCoupon.type === 'fixed') {
      return selectedCoupon.discount;
    } else {
      return total * (selectedCoupon.discount / 100);
    }
  },

  calculateFinalPrice: () => {
    return get().calculateTotal() - get().calculateDiscount();
  },

  submitOrder: async () => {
    const { selectedAddress, paymentMethod } = get();
    const cartStore = useCartStore.getState();
    const selectedItems = cartStore.items.filter(item => item.selected);
    
    if (!selectedAddress) {
      throw new Error('请选择收货地址');
    }

    if (selectedItems.length === 0) {
      throw new Error('请选择要结算的商品');
    }

    // 构建订单请求
    const orderRequest: CreateOrderRequest = {
      items: selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingName: selectedAddress.name,
      shippingPhone: selectedAddress.phone,
      shippingAddress: `${selectedAddress.province} ${selectedAddress.city} ${selectedAddress.district} ${selectedAddress.detail}`,
      paymentMethod: paymentMethod,
    };

    // 调用后端API创建订单
    try {
      const order = await createBuyerOrder(orderRequest);
      
      // 清空购物车
      cartStore.clearSelected();
      
      // Simulate blockchain hash (实际应该从后端返回)
      const blockchainHash = `0x${Math.random().toString(16).slice(2, 34)}`;

      return { orderId: order.id, blockchainHash };
    } catch (error: any) {
      throw new Error(error.message || '创建订单失败');
    }
  },
}));
