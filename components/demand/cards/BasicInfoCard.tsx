import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, Search, Calendar, MapPin, Zap } from 'lucide-react';
import { useDemandStore } from '../../../stores/demandStore';
import { useMapPicker } from '../../../utils/useMapPicker';
import { Input } from '../../ui/input';
import { Slider } from '../../ui/slider';
import { Calendar as CalendarComponent } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MapPickerDialog } from '../MapPickerDialog';

interface BasicInfoCardProps {
  expanded: boolean;
  onToggle: () => void;
}

const units = ['kg', '吨', '斤', '箱', '件'];
const categories = {
  '水果': ['苹果', '橙子', '香蕉', '葡萄', '草莓'],
  '蔬菜': ['西红柿', '黄瓜', '白菜', '萝卜', '茄子'],
  '粮油': ['大米', '小麦', '玉米', '大豆', '花生油'],
};

const productSuggestions = [
  '有机富硒苹果',
  '东北五常大米',
  '新疆红枣',
  '云南咖啡豆',
  '山东大蒜',
  '四川花椒',
];

export function BasicInfoCard({ expanded, onToggle }: BasicInfoCardProps) {
  const { draft, setField } = useDemandStore();
  const mapPicker = useMapPicker();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <>
      <motion.div
        layout
        className="glass-morphism rounded-2xl overflow-hidden"
      >
        {/* 卡片头部 */}
        <motion.button
          onClick={onToggle}
          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#00D6C2]" />
            </div>
            <div className="text-left">
              <h3 className="text-white">基本信息</h3>
              <p className="text-xs text-white/50">商品名称、分类、数量等</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 0 : -180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-white/60" />
          </motion.div>
        </motion.button>

        {/* 卡片内容 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6">
                {/* 商品名称 */}
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    商品名称 <span className="text-[#FF2566]">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      value={draft.productName || ''}
                      onChange={(e) => {
                        setField('productName', e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="输入商品名称，如：有机苹果"
                      className="pl-10 bg-white/5 border-white/10 h-12"
                    />
                    
                    {/* 智能建议 */}
                    {showSuggestions && draft.productName && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0D] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10"
                      >
                        {productSuggestions
                          .filter(s => s.toLowerCase().includes(draft.productName!.toLowerCase()))
                          .map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setField('productName', suggestion);
                                setShowSuggestions(false);
                              }}
                              className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                              <Search className="w-3 h-3 text-[#00D6C2]" />
                              {suggestion}
                            </button>
                          ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* 分类 */}
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    商品分类 <span className="text-[#FF2566]">*</span>
                  </label>
                  <Popover open={showCategories} onOpenChange={setShowCategories}>
                    <PopoverTrigger asChild>
                      <button className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-left text-white/80 hover:bg-white/10 transition-all flex items-center justify-between">
                        <span>
                          {draft.category && draft.category.length > 0
                            ? draft.category.join(' > ')
                            : '请选择分类'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-[#0A0A0D] border-white/10 p-4">
                      <div className="space-y-3">
                        {Object.entries(categories).map(([parent, children]) => (
                          <div key={parent}>
                            <div className="text-sm text-white/60 mb-2">{parent}</div>
                            <div className="flex flex-wrap gap-2">
                              {children.map((child) => (
                                <motion.button
                                  key={child}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setField('category', [parent, child]);
                                    setShowCategories(false);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-white/5 text-sm text-white/80 hover:bg-[#00D6C2]/20 hover:text-[#00D6C2] transition-all"
                                >
                                  {child}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 数量与单位 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">
                      数量 <span className="text-[#FF2566]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setField('quantity', Math.max(1, (draft.quantity || 0) - 1))}
                        className="w-10 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-[#00D6C2] transition-all"
                      >
                        −
                      </motion.button>
                      <Input
                        type="number"
                        value={draft.quantity || ''}
                        onChange={(e) => setField('quantity', Math.max(1, parseInt(e.target.value) || 0))}
                        className="flex-1 bg-white/5 border-white/10 h-12 text-center"
                        min="1"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setField('quantity', (draft.quantity || 0) + 1)}
                        className="w-10 h-12 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border border-[#00D6C2]/30 flex items-center justify-center text-[#00D6C2] hover:shadow-lg transition-all"
                        style={{
                          boxShadow: '0 0 20px rgba(0, 214, 194, 0.2)',
                        }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">单位</label>
                    <select
                      value={draft.unit}
                      onChange={(e) => setField('unit', e.target.value)}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D6C2]/50 transition-all"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 期望单价 */}
                <div className="space-y-3">
                  <label className="text-sm text-white/80 flex items-center justify-between">
                    <span>期望单价</span>
                    {draft.priceExpectation === 0 ? (
                      <span className="text-[#FFD700] text-sm" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
                        面议
                      </span>
                    ) : (
                      <span className="text-[#00D6C2] font-mono">
                        ¥{draft.priceExpectation}/{draft.unit}
                      </span>
                    )}
                  </label>
                  <Slider
                    value={[draft.priceExpectation || 0]}
                    onValueChange={(value) => setField('priceExpectation', value[0])}
                    max={100}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-white/40">
                    <span>面议</span>
                    <span>¥100/{draft.unit}</span>
                  </div>
                </div>

                {/* 交货日期 */}
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    交货日期 <span className="text-[#FF2566]">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-left text-white/80 hover:bg-white/10 transition-all flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-white/40" />
                        {draft.deliveryDate ? (
                          format(draft.deliveryDate, 'PPP', { locale: zhCN })
                        ) : (
                          <span className="text-white/40">选择日期</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#0A0A0D] border-white/10">
                      <CalendarComponent
                        mode="single"
                        selected={draft.deliveryDate}
                        onSelect={(date) => setField('deliveryDate', date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 交货地点 */}
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    交货地点 <span className="text-[#FF2566]">*</span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={mapPicker.open}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-[#00D6C2]" />
                    <span className={draft.deliveryLocation ? 'text-white/80' : 'text-white/40'}>
                      {draft.deliveryLocation?.address || '选择交货地点'}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 地图选点弹窗 */}
      <MapPickerDialog
        isOpen={mapPicker.isOpen}
        onClose={mapPicker.close}
        onConfirm={(location) => {
          setField('deliveryLocation', location);
          mapPicker.close();
        }}
      />
    </>
  );
}
