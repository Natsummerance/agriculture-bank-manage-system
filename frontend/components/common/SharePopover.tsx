import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Download, QrCode, Link2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface SharePopoverProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export default function SharePopover({ 
  url = window.location.href,
  title = '星云·AgriVerse',
  description = '农产品融销一体平台',
  className = '',
  children
}: SharePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('链接已复制到剪贴板');
      setIsOpen(false);
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  const handleDownloadPoster = () => {
    // Mock poster generation
    toast.success('海报生成中...');
    setTimeout(() => {
      toast.success('海报已保存到相册');
      setIsOpen(false);
    }, 1500);
  };

  const handleGenerateQR = () => {
    // Mock QR code generation
    toast.success('二维码生成中...');
    setTimeout(() => {
      toast.success('二维码已生成');
    }, 1000);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className={`w-10 h-10 p-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 ${className}`}
          >
            <Share2 className="w-4 h-4 text-white/70" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-[#00D6C2]/10 p-4"
        align="end"
      >
        <div className="space-y-3">
          <div className="text-center mb-4">
            <h3 className="text-white mb-1">分享到</h3>
            <p className="text-xs text-white/50">{title}</p>
          </div>

          {/* Share Options */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/20 hover:border-[#00D6C2]/40 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#00D6C2]/20 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-5 h-5 text-[#00D6C2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">复制链接</p>
              <p className="text-xs text-white/50 truncate">{url}</p>
            </div>
            <Copy className="w-4 h-4 text-white/40" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateQR}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">生成二维码</p>
              <p className="text-xs text-white/50">扫码分享给好友</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPoster}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#18FF74]/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-[#18FF74]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">生成海报</p>
              <p className="text-xs text-white/50">保存精美分享图</p>
            </div>
          </motion.button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
