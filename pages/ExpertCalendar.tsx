import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, Copy, Trash2, Save, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCalendarStore } from '../stores/calendarStore';
import { toast } from 'sonner';

const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9:00 - 18:00

export default function ExpertCalendar() {
  const {
    viewMode,
    currentDate,
    timeBlocks,
    selectedBlock,
    isDragging,
    setViewMode,
    setCurrentDate,
    updateTimeBlock,
    deleteTimeBlock,
    selectBlock,
    startDrag,
    endDrag,
    batchCopyToNextWeek,
    saveCalendar,
    loadCalendar,
  } = useCalendarStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [tempPrice, setTempPrice] = useState(200);

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCalendar();
      toast.success('日历保存成功！');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToNextWeek = () => {
    batchCopyToNextWeek();
    toast.success('已复制到下周');
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getBlocksForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return timeBlocks.filter((block) => block.date === dateStr);
  };

  const handleCellClick = (date: Date, hour: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    startDrag(date.toISOString().split('T')[0], timeStr);
    setTimeout(() => {
      endDrag(date.toISOString().split('T')[0], `${(hour + 1).toString().padStart(2, '0')}:00`);
    }, 100);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white">专家日历</h1>
            <Button
              onClick={handleCopyToNextWeek}
              variant="outline"
              className="h-10 rounded-xl border-2 border-[#00D6C2]/50 bg-[#00D6C2]/10 text-[#00D6C2] hover:bg-[#00D6C2]/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              复制到下周
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigateWeek('prev')}
                variant="outline"
                className="h-10 w-10 p-0 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="px-4 py-2 rounded-xl border-2 border-white/20 bg-white/5">
                <span className="text-white">
                  {weekDays[0].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} -{' '}
                  {weekDays[6].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                </span>
              </div>
              <Button
                onClick={() => navigateWeek('next')}
                variant="outline"
                className="h-10 w-10 p-0 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`h-10 px-4 rounded-xl transition-all duration-300 ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black'
                      : 'border-2 border-white/20 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {mode === 'month' && '月'}
                  {mode === 'week' && '周'}
                  {mode === 'day' && '日'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b border-white/10">
            <div className="p-4 border-r border-white/10">
              <span className="text-white/60 text-sm">时间</span>
            </div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="p-4 border-r border-white/10 last:border-r-0 text-center"
              >
                <div className="text-white/60 text-sm mb-1">
                  {day.toLocaleDateString('zh-CN', { weekday: 'short' })}
                </div>
                <div className={`text-white ${day.toDateString() === new Date().toDateString() ? 'text-[#18FF74]' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="max-h-[600px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-white/10 last:border-b-0">
                <div className="p-4 border-r border-white/10 flex items-center justify-center">
                  <span className="text-white/60 text-sm">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                {weekDays.map((day, dayIndex) => {
                  const blocks = getBlocksForDay(day);
                  const hourBlocks = blocks.filter((block) => {
                    const startHour = parseInt(block.startTime.split(':')[0]);
                    return startHour === hour;
                  });

                  return (
                    <div
                      key={dayIndex}
                      className="relative p-2 border-r border-white/10 last:border-r-0 min-h-[80px] cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => handleCellClick(day, hour)}
                    >
                      {hourBlocks.map((block) => (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            boxShadow: block.status === 'draft'
                              ? '0 0 20px rgba(24, 255, 116, 0.3)'
                              : 'none',
                          }}
                          whileHover={{ scale: 1.02 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectBlock(block);
                            setTempPrice(block.price);
                            setShowPriceModal(true);
                          }}
                          className={`p-2 rounded-xl text-xs cursor-pointer ${
                            block.status === 'available'
                              ? 'bg-[#00D6C2]/20 border-2 border-[#00D6C2]/50'
                              : block.status === 'booked'
                              ? 'bg-[#18FF74]/20 border-2 border-[#18FF74]/50'
                              : 'bg-white/10 border-2 border-white/30 border-dashed'
                          }`}
                        >
                          <div className="text-white mb-1">
                            {block.startTime} - {block.endTime}
                          </div>
                          <div className={`${block.status === 'booked' ? 'text-[#18FF74]' : 'text-[#00D6C2]'}`}>
                            ¥{block.price}
                          </div>
                          {block.service && (
                            <div className="text-white/60 mt-1 truncate">
                              {block.service}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#00D6C2]/20 border-2 border-[#00D6C2]/50" />
            <span className="text-white/60">可预约</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#18FF74]/20 border-2 border-[#18FF74]/50" />
            <span className="text-white/60">已预约</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/10 border-2 border-white/30 border-dashed" />
            <span className="text-white/60">草稿</span>
          </div>
        </div>
      </div>

      {/* Price Modal */}
      {showPriceModal && selectedBlock && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPriceModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border-2 border-[#00D6C2]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8"
          >
            <h3 className="text-white mb-6">设置价格</h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="text-white/60 text-sm mb-3 block">时间段</label>
                <div className="text-white">
                  {selectedBlock.startTime} - {selectedBlock.endTime}
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-3 block">价格（¥/时段）</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00D6C2] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white/40 text-sm">¥100</span>
                  <span className="text-[#00D6C2]">¥{tempPrice}</span>
                  <span className="text-white/40 text-sm">¥1000</span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-3 block">服务类型（可选）</label>
                <input
                  type="text"
                  value={selectedBlock.service || ''}
                  onChange={(e) =>
                    updateTimeBlock(selectedBlock.id, { service: e.target.value })
                  }
                  placeholder="例如：农业技术咨询"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-[#00D6C2] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  deleteTimeBlock(selectedBlock.id);
                  setShowPriceModal(false);
                  toast.success('时段已删除');
                }}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-2 border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
              <Button
                onClick={() => {
                  updateTimeBlock(selectedBlock.id, { price: tempPrice });
                  setShowPriceModal(false);
                  toast.success('价格已更新');
                }}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                确认
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              拖拽或点击创建时段，点击时段编辑价格
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                  />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  保存日历
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
