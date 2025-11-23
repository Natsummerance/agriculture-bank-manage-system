import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'sonner';

interface CartItem {
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

interface CartPageProps {
  onNavigate?: (path: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps = {}) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'p1',
      name: '有机富硒苹果',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
      price: 12.8,
      quantity: 5,
      stock: 100,
      origin: '陕西延安',
      selected: true,
    },
    {
      id: '2',
      productId: 'p2',
      name: '东北五常大米',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      price: 8.5,
      quantity: 10,
      stock: 200,
      origin: '黑龙江五常',
      selected: true,
    },
  ]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allSelected = items.length > 0 && items.every(item => item.selected);
  const selectedItems = items.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelectAll = (checked: boolean) => {
    setItems(items.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, selected: checked } : item));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        if (newQty !== item.quantity) {
          // Mock API call
          toast.success('数量已更新');
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleInputQty = (id: string, value: string) => {
    const qty = parseInt(value) || 1;
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, qty));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setItems(items.filter(item => item.id !== deleteId));
      toast.success('已移除商品');
      setDeleteId(null);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('请选择要结算的商品');
      return;
    }
    
    // 生成订单详情
    const orderSummary = selectedItems.map(item => 
      `${item.name} x${item.quantity}`
    ).join(', ');
    
    toast.success('正在前往结算...', {
      description: `商品: ${orderSummary}`,
      duration: 3000
    });
    
    if (onNavigate) {
      setTimeout(() => {
        onNavigate('/order/confirm');
      }, 400);
    } else {
      setTimeout(() => {
        toast.success('订单已创建！', {
          description: `订单总额：¥${totalAmount.toFixed(2)}，请尽快支付`,
          duration: 5000
        });
      }, 800);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-[#00D6C2]" />
          </div>
          <h3 className="text-xl text-white/90 mb-4">购物车空空如也</h3>
          <p className="text-white/50 mb-8">去挑选心仪的农产品吧</p>
          <Button
            onClick={() => {
              if (onNavigate) {
                onNavigate('/');
              } else {
                toast.info('返回首页浏览商品');
              }
            }}
            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D]"
          >
            去逛逛
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0D] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShoppingCart className="w-6 h-6 text-[#00D6C2]" />
              <h1 className="text-xl text-white">购物车</h1>
              <span className="text-sm text-white/50">共 {items.length} 件商品</span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                id="select-all"
              />
              <label htmlFor="select-all" className="text-sm text-white/70 cursor-pointer">
                全选
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              className="mb-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00D6C2]/30 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  className="mt-2"
                />

                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-white/50 mb-2">产地: {item.origin}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-[#00D6C2]">¥{item.price.toFixed(2)}</span>
                    <span className="text-xs text-white/40">库存 {item.stock} 件</span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg bg-white/5 hover:bg-white/10"
                    onClick={() => handleUpdateQty(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleInputQty(item.id, e.target.value)}
                    className="w-12 h-8 text-center bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg bg-white/5 hover:bg-white/10"
                    onClick={() => handleUpdateQty(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Delete */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Checkout Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-[#0A0A0D]/95 backdrop-blur-xl border-t border-white/10 pb-safe"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  id="select-all-bottom"
                />
                <label htmlFor="select-all-bottom" className="text-sm text-white/70 cursor-pointer">
                  全选
                </label>
              </div>
              <div className="text-sm text-white/50">
                已选 <span className="text-[#18FF74]">{selectedItems.length}</span> 件
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-white/50 mb-1">合计</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/70">¥</span>
                  <span className="text-2xl text-[#00D6C2]">{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="min-w-[120px] h-12 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:opacity-90"
              >
                去结算
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0D] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">确认删除</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              确定要将此商品从购物车中移除吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white border-white/10">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}