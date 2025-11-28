import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Search, MapPin, Navigation } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { Location } from '../../utils/useMapPicker';

interface MapPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: Location) => void;
}

const mockLocations: Location[] = [
  { address: '北京市朝阳区建外大街1号国贸中心', lat: 39.9087, lng: 116.4589 },
  { address: '北京市海淀区中关村大街27号', lat: 39.9891, lng: 116.3142 },
  { address: '北京市东城区王府井大街255号', lat: 39.9289, lng: 116.4056 },
  { address: '上海市浦东新区陆家嘴环路1000号', lat: 31.2397, lng: 121.4990 },
  { address: '广州市天河区天河路208号', lat: 23.1367, lng: 113.3240 },
];

export function MapPickerDialog({ isOpen, onClose, onConfirm }: MapPickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Mock search
      const results = mockLocations.filter(loc =>
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedLocation(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-end"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-[70vh] bg-[#0A0F1E]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10 shadow-2xl shadow-[#00D6C2]/10 flex flex-col"
          >
            {/* 头部 */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00D6C2]" />
                  选择交货地点
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </motion.button>
              </div>

              {/* 搜索栏 */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="搜索地址..."
                    className="pl-10 bg-white/5 border-white/10 h-12"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D]"
                >
                  搜索
                </Button>
              </div>
            </div>

            {/* 地图区域 */}
            <div className="flex-1 relative overflow-hidden">
              {/* 模拟地图 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Navigation className="w-12 h-12 text-[#00D6C2]" />
                  </motion.div>
                </div>

                {/* 网格背景 */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0, 214, 194, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 214, 194, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* 中心十字线 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-8 h-8 border-2 border-[#00D6C2] rounded-full"
                />
              </div>

              {/* 搜索结果列表 */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 max-h-64 overflow-y-auto bg-[#0A0F1E]/95 backdrop-blur-xl border-t border-white/10"
                >
                  {searchResults.map((location, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      onClick={() => setSelectedLocation(location)}
                      className={`w-full p-4 text-left border-b border-white/5 transition-colors ${
                        selectedLocation?.address === location.address
                          ? 'bg-[#00D6C2]/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#00D6C2] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/90">{location.address}</div>
                          <div className="text-xs text-white/40 mt-1">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* 底部确认 */}
            <div className="p-6 border-t border-white/10 flex-shrink-0">
              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-[#00D6C2]/10 border border-[#00D6C2]/20"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#00D6C2] mt-0.5" />
                    <div className="text-sm text-white/80">{selectedLocation.address}</div>
                  </div>
                </motion.div>
              )}
              <Button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="w-full h-12 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] disabled:opacity-50"
              >
                确认选择
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
