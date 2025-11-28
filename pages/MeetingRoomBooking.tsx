import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, MapPin, ChevronRight, Sparkles, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { useMeetStore } from '../stores/meetStore';
import { toast } from 'sonner';

const steps = [
  { id: 0, name: '选择日期', icon: Calendar },
  { id: 1, name: '选择时段', icon: Clock },
  { id: 2, name: '选择会议室', icon: MapPin },
  { id: 3, name: '邀请成员', icon: Users },
];

export default function MeetingRoomBooking() {
  const {
    step,
    selectedDate,
    selectedTime,
    selectedRoom,
    invitedMembers,
    purpose,
    roomList,
    timeSlots,
    setStep,
    setSelectedDate,
    setSelectedTime,
    setSelectedRoom,
    addMember,
    removeMember,
    setPurpose,
    loadRooms,
    loadTimeSlots,
    bookRoom,
    reset,
  } = useMeetStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const handleNext = () => {
    if (step === 0 && !selectedDate) {
      toast.error('请选择日期');
      return;
    }
    if (step === 1 && !selectedTime) {
      toast.error('请选择时段');
      return;
    }
    if (step === 2 && !selectedRoom) {
      toast.error('请选择会议室');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (invitedMembers.length === 0) {
      toast.error('请至少邀请一位成员');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bookRoom();
      setBookingResult(result);
      setShowSuccess(true);
      toast.success('会议室预约成功！');
    } catch (error: any) {
      toast.error(error.message || '预约失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockMembers = [
    { id: '1', name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member1', role: 'expert' as const },
    { id: '2', name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member2', role: 'farmer' as const },
    { id: '3', name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member3', role: 'bank' as const },
    { id: '4', name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member4', role: 'buyer' as const },
  ];

  const roleColors = {
    farmer: '#18FF74',
    expert: '#00D6C2',
    bank: '#FFB800',
    buyer: '#FF6B9D',
    admin: '#A78BFA',
  };

  if (showSuccess && bookingResult) {
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
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 rounded-full bg-[#18FF74]/30 blur-2xl"
                />
                <Check className="w-20 h-20 text-[#18FF74] relative z-10" strokeWidth={2} />
              </div>
            </motion.div>

            <h2 className="text-center mb-2 text-white">预约成功</h2>
            <p className="text-center text-[#00D6C2] mb-8">会议室已为您预留</p>

            <div className="space-y-3 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">会议室</span>
                  <span className="text-white">{selectedRoom?.name}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">时间</span>
                  <span className="text-white">
                    {selectedDate?.toLocaleDateString('zh-CN')} {selectedTime?.start}-{selectedTime?.end}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2">
                  <span className="text-white/60">区块链存证</span>
                  <span className="text-[#00D6C2] text-xs break-all font-mono">
                    {bookingResult.blockchainHash}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                reset();
                setShowSuccess(false);
                setBookingResult(null);
              }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              返回
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white mb-6">预约会议室</h1>

          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    animate={{
                      scale: step >= s.id ? 1 : 0.9,
                      borderColor: step >= s.id ? '#18FF74' : 'rgba(255,255,255,0.2)',
                      backgroundColor: step >= s.id ? 'rgba(24,255,116,0.1)' : 'transparent',
                    }}
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  >
                    <s.icon className={`w-5 h-5 ${step >= s.id ? 'text-[#18FF74]' : 'text-white/40'}`} />
                  </motion.div>
                  <span className={`text-xs ${step >= s.id ? 'text-white' : 'text-white/40'}`}>
                    {s.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 mb-8">
                    <motion.div
                      animate={{
                        scaleX: step > s.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-[#18FF74] origin-left"
                    />
                    <div className="h-full bg-white/20" style={{ marginTop: '-1px' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 0: Select Date */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
              <h3 className="text-white mb-6">选择日期</h3>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date || null)}
                  className="rounded-2xl border-2 border-white/10"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Select Time */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
              <h3 className="text-white mb-6">选择时段（30分钟颗粒）</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: slot.available ? 1.02 : 1 }}
                    whileTap={{ scale: slot.available ? 0.98 : 1 }}
                    onClick={() => slot.available && setSelectedTime(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedTime?.start === slot.start
                        ? 'border-[#18FF74] bg-[#18FF74]/10'
                        : slot.available
                        ? 'border-white/20 bg-white/5 hover:border-[#00D6C2]/50'
                        : 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{slot.start}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Room */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
              <h3 className="text-white mb-6">选择会议室</h3>
              <div className="space-y-4">
                {roomList.map((room) => (
                  <motion.button
                    key={room.id}
                    whileHover={{ scale: room.available ? 1.01 : 1 }}
                    onClick={() => room.available && setSelectedRoom(room)}
                    disabled={!room.available}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedRoom?.id === room.id
                        ? 'border-[#18FF74] bg-[#18FF74]/10'
                        : room.available
                        ? 'border-white/20 bg-white/5 hover:border-[#00D6C2]/50'
                        : 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={room.thumbnail}
                        alt={room.name}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white">{room.name}</h4>
                          {!room.available && (
                            <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
                              已预约
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                          <span>📍 {room.floor}</span>
                          <span>👥 {room.capacity}人</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.equipment.map((eq, i) => (
                            <span
                              key={i}
                              className="text-xs text-[#00D6C2] bg-[#00D6C2]/10 px-3 py-1 rounded-full"
                            >
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Invite Members */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
              <h3 className="text-white mb-6">邀请成员</h3>
              
              {/* Selected Members */}
              {invitedMembers.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-3">已邀请 ({invitedMembers.length})</p>
                  <div className="flex flex-wrap gap-3">
                    {invitedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5"
                      >
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-sm">{member.name}</span>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="ml-2 text-white/40 hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Members */}
              <p className="text-white/60 text-sm mb-3">通讯录</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockMembers
                  .filter((m) => !invitedMembers.find((im) => im.id === m.id))
                  .map((member) => (
                    <motion.button
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addMember(member)}
                      className="flex items-center gap-3 p-4 rounded-2xl border-2 border-white/20 bg-white/5 hover:border-[#00D6C2]/50 transition-all duration-300"
                    >
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1 text-left">
                        <p className="text-white">{member.name}</p>
                        <p
                          className="text-xs"
                          style={{ color: roleColors[member.role] }}
                        >
                          {member.role === 'farmer' && '农户'}
                          {member.role === 'expert' && '专家'}
                          {member.role === 'bank' && '银行'}
                          {member.role === 'buyer' && '买家'}
                        </p>
                      </div>
                    </motion.button>
                  ))}
              </div>

              {/* Meeting Purpose */}
              <div className="mt-6">
                <label className="text-white/60 text-sm mb-3 block">会议主题（可选）</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="请输入会议主题"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-[#00D6C2] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 pb-8">
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                上一步
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                下一步
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                    />
                    确认预约中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    确认预约
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
