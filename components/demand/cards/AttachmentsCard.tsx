import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import { ChevronDown, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { useDemandStore } from '../../../stores/demandStore';
import { toast } from 'sonner';
import { Textarea } from '../../ui/textarea';

interface AttachmentsCardProps {
  expanded: boolean;
  onToggle: () => void;
}

export function AttachmentsCard({ expanded, onToggle }: AttachmentsCardProps) {
  const { draft, setField, addImage, removeImage } = useDemandStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        if ((draft.images?.length || 0) >= 3) {
          toast.error('最多上传3张图片');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('图片大小不能超过5MB');
          return;
        }
        // Mock upload
        const mockUrl = URL.createObjectURL(file);
        addImage(mockUrl);
        toast.success('图片上传成功');
      }
    });
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过10MB');
      return;
    }

    // Mock upload
    const mockAttachment = {
      name: file.name,
      url: '#',
      size: file.size,
    };
    
    setField('attachments', [...(draft.attachments || []), mockAttachment]);
    toast.success('文件上传成功');
  };

  const removeAttachment = (index: number) => {
    const newAttachments = draft.attachments?.filter((_, i) => i !== index) || [];
    setField('attachments', newAttachments);
  };

  return (
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#18FF74]/20 to-[#00D6C2]/20 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[#18FF74]" />
          </div>
          <div className="text-left">
            <h3 className="text-white">附件与说明</h3>
            <p className="text-xs text-white/50">上传参考图片和文档</p>
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
              {/* 参考图片 */}
              <div className="space-y-3">
                <label className="text-sm text-white/80">
                  参考图片 <span className="text-white/40">(最多3张，≤5MB/张)</span>
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* 已上传的图片 */}
                  {draft.images?.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </motion.button>
                    </motion.div>
                  ))}

                  {/* 上传按钮 */}
                  {(!draft.images || draft.images.length < 3) && (
                    <motion.div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleImageClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square rounded-xl border-2 border-dashed ${
                        isDragging ? 'border-[#00D6C2] bg-[#00D6C2]/10' : 'border-white/20'
                      } flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00D6C2] hover:bg-white/5 transition-all`}
                    >
                      <Upload className="w-6 h-6 text-white/40" />
                      <span className="text-xs text-white/40">点击或拖拽</span>
                    </motion.div>
                  )}
                </div>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* 说明文字 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/80">说明文字</label>
                  <span className="text-xs text-white/40">
                    {draft.description?.length || 0}/500
                  </span>
                </div>
                <Textarea
                  value={draft.description || ''}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="描述您的需求，如质量要求、包装要求等..."
                  maxLength={500}
                  rows={6}
                  className="bg-white/5 border-white/10 resize-none"
                />
                <div className="flex gap-2 text-xs text-white/40">
                  <button className="hover:text-[#00D6C2] transition-colors">**粗体**</button>
                  <button className="hover:text-[#00D6C2] transition-colors">*斜体*</button>
                  <button className="hover:text-[#00D6C2] transition-colors">- 列表</button>
                </div>
              </div>

              {/* 附件文档 */}
              <div className="space-y-3">
                <label className="text-sm text-white/80">
                  附件文档 <span className="text-white/40">(PDF/Excel，≤10MB)</span>
                </label>
                
                {draft.attachments && draft.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {draft.attachments.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <FileText className="w-5 h-5 text-[#FFD700]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/80 truncate">{file.name}</div>
                          <div className="text-xs text-white/40">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeAttachment(index)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : null}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFileUpload}
                  className="w-full h-12 rounded-xl border border-dashed border-white/20 hover:border-[#00D6C2] hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/60"
                >
                  <Upload className="w-4 h-4" />
                  上传文档
                </motion.button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
