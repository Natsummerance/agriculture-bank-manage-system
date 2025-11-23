import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Image as ImageIcon, Sparkles, X, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BuyerDemandPageProps {
  onClose?: () => void;
}

interface FormData {
  productName: string;
  quantity: string;
  unit: string;
  priceExpectation: number;
  deliveryDate: Date | undefined;
  deliveryAddress: string;
  description: string;
  images: string[];
}

const units = ['kg', '吨', '斤', '箱', '件'];

const productSuggestions = [
  '有机富硒苹果',
  '东北五常大米',
  '新疆红枣',
  '云南咖啡豆',
  '山东大蒜',
  '四川花椒',
];

export default function BuyerDemandPage({ onClose }: BuyerDemandPageProps = {}) {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    quantity: '',
    unit: 'kg',
    priceExpectation: 0,
    deliveryDate: undefined,
    deliveryAddress: '',
    description: '',
    images: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiDraft, setAiDraft] = useState<Partial<FormData> | null>(null);

  const handleAiDraft = () => {
    // Mock AI auto-fill based on history
    const mockDraft: Partial<FormData> = {
      productName: '有机富硒苹果',
      quantity: '500',
      unit: 'kg',
      priceExpectation: 12,
      deliveryAddress: '北京市朝阳区',
      description: '需要优质有机苹果，用于超市零售，要求无虫害，色泽鲜艳。',
    };
    setAiDraft(mockDraft);
    toast.success('AI已为您预填充数据，请确认修改');
  };

  const applyAiDraft = () => {
    if (aiDraft) {
      setFormData({ ...formData, ...aiDraft });
      setAiDraft(null);
      toast.success('已应用AI预填充');
    }
  };

  const handleImageUpload = () => {
    // Mock image upload
    if (formData.images.length >= 3) {
      toast.error('最多上传3张图片');
      return;
    }
    const mockImage = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    setFormData({
      ...formData,
      images: [...formData.images, mockImage],
    });
    toast.success('图片上传成功');
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.productName) {
      toast.error('请输入商品名称');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error('请输入有效数量');
      return;
    }
    if (!formData.deliveryDate) {
      toast.error('请选择交货日期');
      return;
    }
    if (!formData.deliveryAddress) {
      toast.error('请输入交货地址');
      return;
    }

    // Mock API call
    toast.success('需求发布成功！正在智能匹配农户...');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  const isFormComplete = formData.productName &&
    formData.quantity &&
    formData.deliveryDate &&
    formData.deliveryAddress;

  return (
    <div className="min-h-screen bg-[#0A0A0D] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0D]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClose && onClose()}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
              <h1 className="text-xl text-white">发布求购需求</h1>
            </div>
            <Button
              onClick={handleAiDraft}
              size="sm"
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI预填充
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* AI Draft Preview */}
        {aiDraft && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-white">AI为您准备的内容</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAiDraft(null)}
                className="text-white/50 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-white/70 mb-3 space-y-1">
              <p>商品: {aiDraft.productName}</p>
              <p>数量: {aiDraft.quantity} {aiDraft.unit}</p>
              <p>地址: {aiDraft.deliveryAddress}</p>
            </div>
            <Button
              onClick={applyAiDraft}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              应用此方案
            </Button>
          </motion.div>
        )}

        {/* Product Name with Suggestions */}
        <div className="mb-6">
          <label className="block text-white mb-2">商品名称 *</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => {
                setFormData({ ...formData, productName: e.target.value });
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="输入商品名称，如：有机苹果"
              className="w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all"
            />
            {showSuggestions && formData.productName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0D] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"
              >
                {productSuggestions
                  .filter(s => s.toLowerCase().includes(formData.productName.toLowerCase()))
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, productName: suggestion });
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/5 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white mb-2">数量 *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="输入数量"
              min="1"
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-white mb-2">单位</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D6C2]/50 transition-all"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Expectation */}
        <div className="mb-6">
          <label className="block text-white mb-3">
            期望单价 {formData.priceExpectation > 0 ? `¥${formData.priceExpectation}/${formData.unit}` : '(面议)'}
          </label>
          <Slider
            value={[formData.priceExpectation]}
            onValueChange={(value) => setFormData({ ...formData, priceExpectation: value[0] })}
            max={100}
            step={0.5}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-white/40">
            <span>面议</span>
            <span>¥100/{formData.unit}</span>
          </div>
        </div>

        {/* Delivery Date */}
        <div className="mb-6">
          <label className="block text-white mb-2">交货日期 *</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                <Calendar className="w-5 h-5 mr-2 text-white/40" />
                {formData.deliveryDate ? (
                  format(formData.deliveryDate, 'PPP', { locale: zhCN })
                ) : (
                  <span className="text-white/40">选择日期</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0A0A0D] border-white/10">
              <CalendarComponent
                mode="single"
                selected={formData.deliveryDate}
                onSelect={(date) => setFormData({ ...formData, deliveryDate: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Delivery Address */}
        <div className="mb-6">
          <label className="block text-white mb-2">交货地址 *</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              placeholder="输入详细地址"
              className="w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white mb-2">需求描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述您的需求，如质量要求、包装要求等..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all resize-none"
          />
        </div>

        {/* Images */}
        <div className="mb-8">
          <label className="block text-white mb-2">附件图片 (最多3张)</label>
          <div className="grid grid-cols-3 gap-3">
            {formData.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </motion.div>
            ))}
            {formData.images.length < 3 && (
              <button
                onClick={handleImageUpload}
                className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs">上传图片</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={isFormComplete ? { scale: 1.02 } : {}}
          whileTap={isFormComplete ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className="relative w-full h-14 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]" />
          {isFormComplete && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: 0,
                  }}
                  animate={{
                    y: [-20, -60],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.03,
                  }}
                />
              ))}
            </>
          )}
          <span className="relative z-10 text-[#0A0A0D] flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            发布需求
          </span>
        </motion.button>

        <div className="mt-4 text-center text-sm text-white/40">
          发布后将自动进入智能匹配池，推送给相关农户
        </div>
      </div>
    </div>
  );
}
