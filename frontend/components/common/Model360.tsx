import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Model360Props {
  images: string[];
  className?: string;
}

export default function Model360({ images, className = '' }: Model360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 30;
    const offset = info.offset.x;
    
    if (Math.abs(offset) > threshold) {
      const direction = offset > 0 ? -1 : 1;
      const newIndex = (currentIndex + direction + images.length) % images.length;
      setCurrentIndex(newIndex);
    }
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 1));
  };

  const handleReset = () => {
    setZoom(1);
    setCurrentIndex(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black/20 rounded-2xl overflow-hidden ${className}`}
    >
      {/* 360° Badge */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
        <RotateCcw className="w-3 h-3 text-[#00D6C2] animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-xs text-white">360° 可旋转</span>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomIn}
          className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomOut}
          className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </Button>
      </div>

      {/* Image */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="relative h-full w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: zoom }}
          transition={{ duration: 0.3 }}
          src={images[currentIndex]}
          alt={`360° view ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </motion.div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-[#00D6C2] w-8'
                : 'bg-white/30 w-1'
            }`}
          />
        ))}
      </div>

      {/* Instruction */}
      {!isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          拖动旋转 · 缩放查看
        </motion.div>
      )}
    </div>
  );
}
