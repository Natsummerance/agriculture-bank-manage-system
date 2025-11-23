import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Tag, CreditCard, Smartphone, Building2, Zap, Check, ChevronRight, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useCheckoutStore } from '../stores/checkoutStore';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'alipay' as const, name: '支付宝', icon: Smartphone, color: '#00A0E9' },
  { id: 'wechat' as const, name: '微信支付', icon: Smartphone, color: '#07C160' },
  { id: 'bank' as const, name: '银行卡', icon: CreditCard, color: '#FF6B9D' },
  { id: 'agripay' as const, name: '农付通', icon: Zap, color: '#18FF74' },
];

const installmentOptions = [3, 6, 12, 24];

export default function Checkout() {
  const {
    cartItems,
    selectedAddress,
    selectedCoupon,
    installmentEnabled,
    installmentMonths,
    paymentMethod,
    addresses,
    coupons,
    setSelectedAddress,
    setSelectedCoupon,
    toggleInstallment,
    setInstallmentMonths,
    setPaymentMethod,
    loadAddresses,
    loadCoupons,
    loadCartItems,
    calculateTotal,
    calculateDiscount,
    calculateFinalPrice,
    submitOrder,
  } = useCheckoutStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    loadCartItems();
    loadAddresses();
    loadCoupons();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitOrder();
      setOrderResult(result);
      setShowSuccess(true);
      toast.success('订单提交成功！');
    } catch (error: any) {
      toast.error(error.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess && orderResult) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border-2 border-[#18FF74]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-[#18FF74]/30 blur-2xl"
                />
                <Check className="w-20 h-20 text-[#18FF74] relative z-10" strokeWidth={2} />
              </div>
            </motion.div>

            <h2 className="text-center mb-2 text-white">订单支付成功</h2>
            <p className="text-center text-[#00D6C2] mb-8">预计3-5天送达</p>

            <div className="space-y-3 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">订单号</span>
                  <span className="text-white">{orderResult.orderId}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">支付金额</span>
                  <span className="text-[#18FF74]">¥ {calculateFinalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2">
                  <span className="text-white/60">区块链存证</span>
                  <span className="text-[#00D6C2] text-xs break-all font-mono">
                    {orderResult.blockchainHash}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => window.location.href = '/'}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              返回首页
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pb-48">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white">确认订单</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Address Section */}
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-white">收货地址</h3>
            </div>
            <Button
              onClick={() => setShowAddressModal(true)}
              variant="ghost"
              className="text-[#00D6C2] hover:text-[#00D6C2]/80"
            >
              <Plus className="w-4 h-4 mr-1" />
              新增
            </Button>
          </div>

          {selectedAddress ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-2xl border-2 border-[#18FF74]/50 bg-[#18FF74]/10 cursor-pointer"
              onClick={() => setShowAddressModal(true)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-white">{selectedAddress.name}</span>
                  <span className="text-white/60 ml-4">{selectedAddress.phone}</span>
                </div>
                {selectedAddress.isDefault && (
                  <span className="text-xs text-[#18FF74] bg-[#18FF74]/20 px-2 py-1 rounded-full">
                    默认
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm">
                {selectedAddress.province} {selectedAddress.city} {selectedAddress.district}{' '}
                {selectedAddress.detail}
              </p>
            </motion.div>
          ) : (
            <Button
              onClick={() => setShowAddressModal(true)}
              className="w-full h-20 rounded-2xl border-2 border-dashed border-white/30 bg-white/5 text-white/60 hover:bg-white/10"
            >
              <Plus className="w-5 h-5 mr-2" />
              添加收货地址
            </Button>
          )}
        </div>

        {/* Cart Items */}
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-white mb-4">商品清单</h3>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-white mb-1">{item.name}</h4>
                  <p className="text-white/60 text-sm mb-2">
                    ¥{item.price} / {item.unit}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">数量: {item.quantity}</span>
                    <span className="text-[#18FF74]">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-white">优惠券</h3>
            </div>
            <Button
              onClick={() => setShowCouponModal(true)}
              variant="ghost"
              className="text-[#00D6C2] hover:text-[#00D6C2]/80"
            >
              {selectedCoupon ? '更换' : '选择'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {selectedCoupon && (
            <div className="mt-4 p-4 rounded-2xl border-2 border-[#18FF74]/50 bg-[#18FF74]/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white mb-1">{selectedCoupon.name}</p>
                  <p className="text-white/60 text-sm">
                    满¥{selectedCoupon.minAmount}可用
                  </p>
                </div>
                <div className="text-[#18FF74]">
                  {selectedCoupon.type === 'fixed' ? `-¥${selectedCoupon.discount}` : `-${selectedCoupon.discount}%`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Installment Section */}
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">分期付款</h3>
            <Switch checked={installmentEnabled} onCheckedChange={toggleInstallment} />
          </div>

          {installmentEnabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {installmentOptions.map((months) => (
                  <Button
                    key={months}
                    onClick={() => setInstallmentMonths(months)}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      installmentMonths === months
                        ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black'
                        : 'border-2 border-white/20 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {months}期
                  </Button>
                ))}
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-white/60 text-sm">
                  每期还款：
                  <span className="text-[#18FF74] ml-2">
                    ¥{(calculateFinalPrice() / installmentMonths).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-white mb-4">支付方式</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  paymentMethod === method.id
                    ? 'border-[#18FF74] bg-[#18FF74]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <method.icon
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: method.color }}
                />
                <p className="text-white text-sm">{method.name}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddressModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border-2 border-[#00D6C2]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8"
          >
            <h3 className="text-white mb-6">选择地址</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {addresses.map((addr) => (
                <motion.button
                  key={addr.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddressModal(false);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                    selectedAddress?.id === addr.id
                      ? 'border-[#18FF74] bg-[#18FF74]/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white">{addr.name}</span>
                      <span className="text-white/60 ml-4">{addr.phone}</span>
                    </div>
                    {addr.isDefault && (
                      <span className="text-xs text-[#18FF74] bg-[#18FF74]/20 px-2 py-1 rounded-full">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">
                    {addr.province} {addr.city} {addr.district} {addr.detail}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCouponModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border-2 border-[#00D6C2]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8"
          >
            <h3 className="text-white mb-6">选择优惠券</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coupons.map((coupon) => {
                const total = calculateTotal();
                const available = coupon.minAmount <= total;
                return (
                  <motion.button
                    key={coupon.id}
                    whileHover={{ scale: available ? 1.01 : 1 }}
                    onClick={() => {
                      if (available) {
                        setSelectedCoupon(coupon);
                        setShowCouponModal(false);
                      }
                    }}
                    disabled={!available}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selectedCoupon?.id === coupon.id
                        ? 'border-[#18FF74] bg-[#18FF74]/10'
                        : available
                        ? 'border-white/20 bg-white/5 hover:border-white/40'
                        : 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white mb-1">{coupon.name}</p>
                        <p className="text-white/60 text-sm">
                          满¥{coupon.minAmount}可用
                        </p>
                      </div>
                      <div className={available ? 'text-[#18FF74]' : 'text-white/40'}>
                        {coupon.type === 'fixed' ? `-¥${coupon.discount}` : `-${coupon.discount}%`}
                      </div>
                    </div>
                    <p className="text-white/40 text-xs">
                      有效期至 {coupon.expireDate}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/60 text-sm mb-1">商品总额</div>
              <div className="text-white text-sm">¥{calculateTotal().toFixed(2)}</div>
            </div>
            {selectedCoupon && (
              <div>
                <div className="text-white/60 text-sm mb-1">优惠</div>
                <div className="text-[#00D6C2] text-sm">-¥{calculateDiscount().toFixed(2)}</div>
              </div>
            )}
            <div>
              <div className="text-white/60 text-sm mb-1">实付款</div>
              <div className="text-[#18FF74]">¥{calculateFinalPrice().toFixed(2)}</div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedAddress}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                />
                提交订单中...
              </>
            ) : (
              <>
                <Fingerprint className="w-5 h-5 mr-2" />
                提交订单
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
