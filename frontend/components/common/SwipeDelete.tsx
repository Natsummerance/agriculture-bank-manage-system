import { useRef, useState } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Trash2 } from 'lucide-react';

interface SwipeDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  threshold?: number;
}

export default function SwipeDelete({ 
  children, 
  onDelete,
  threshold = 80 
}: SwipeDeleteProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -threshold) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, 300);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
      {/* Delete Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: Math.abs(offsetX) / threshold }}
        className="absolute inset-0 bg-gradient-to-l from-red-500/20 to-transparent flex items-center justify-end pr-6"
      >
        <Trash2 className="w-5 h-5 text-red-400" />
      </motion.div>

      {/* Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDrag={(_, info) => setOffsetX(info.offset.x)}
        onDragEnd={handleDragEnd}
        animate={{ 
          x: isDeleting ? -1000 : 0,
          opacity: isDeleting ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );
}
