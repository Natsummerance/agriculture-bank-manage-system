import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Calendar, MapPin, DollarSign, Globe, FileText } from 'lucide-react';
import type { DemandDraft } from '../../stores/demandStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  draft: DemandDraft;
}

export function PreviewDrawer({ isOpen, onClose, draft }: PreviewDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* 抽屉 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0A0F1E]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl shadow-[#00D6C2]/20 z-[90] flex flex-col"
          >
            {/* 头部 */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white">需求预览</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </motion.button>
              </div>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl space-y-6">
                {/* 商品信息 */}
                <div className="glass-morphism rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#00D6C2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-1">
                        {draft.productName || '未填写商品名称'}
                      </h3>
                      {draft.category && draft.category.length > 0 && (
                        <div className="flex gap-2">
                          {draft.category.map((cat, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded bg-[#00D6C2]/10 text-[#00D6C2]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-white/60 w-20">数量:</span>
                      <span className="text-white/90 font-mono">
                        {draft.quantity || 0} {draft.unit}
                      </span>
                    </div>

                    {draft.priceExpectation !== undefined && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-white/60 w-20">期望单价:</span>
                        <span className="text-[#00D6C2] font-mono">
                          {draft.priceExpectation === 0
                            ? '面议'
                            : `¥${draft.priceExpectation}/${draft.unit}`}
                        </span>
                      </div>
                    )}

                    {draft.deliveryDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">交货日期:</span>
                        <span className="text-white/90">
                          {format(draft.deliveryDate, 'PPP', { locale: zhCN })}
                        </span>
                      </div>
                    )}

                    {draft.deliveryLocation && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                        <span className="text-white/60">交货地点:</span>
                        <span className="text-white/90 flex-1">
                          {draft.deliveryLocation.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 图片 */}
                {draft.images && draft.images.length > 0 && (
                  <div className="glass-morphism rounded-2xl p-6">
                    <h4 className="text-white mb-4">参考图片</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {draft.images.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-xl overflow-hidden"
                        >
                          <img
                            src={image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 描述 */}
                {draft.description && (
                  <div className="glass-morphism rounded-2xl p-6">
                    <h4 className="text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#18FF74]" />
                      需求描述
                    </h4>
                    <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {draft.description}
                    </div>
                  </div>
                )}

                {/* 附件 */}
                {draft.attachments && draft.attachments.length > 0 && (
                  <div className="glass-morphism rounded-2xl p-6">
                    <h4 className="text-white mb-3">附件文档</h4>
                    {draft.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <FileText className="w-5 h-5 text-[#FFD700]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/80 truncate">{file.name}</div>
                          <div className="text-xs text-white/40">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 发布设置 */}
                <div className="glass-morphism rounded-2xl p-6">
                  <h4 className="text-white mb-4">发布设置</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-[#00D6C2]" />
                      <span className="text-white/60">可见性:</span>
                      <span className="text-white/90">
                        {draft.isPublic ? '公开' : '私密'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-[#18FF74]" />
                      <span className="text-white/60">报价:</span>
                      <span className="text-white/90">
                        {draft.allowBidding ? '允许' : '不允许'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-white/60">有效期:</span>
                      <span className="text-white/90">{draft.autoExpireDays}天</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
