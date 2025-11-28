import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Video, Mic, FileText, Camera, Check, Sparkles } from "lucide-react";

type MediaType = 'video' | 'audio' | 'text';

interface FormData {
  purpose: string;
  amount: string;
  period: string;
  collateral: string;
}

export function DemandPublisher() {
  const [activeMedia, setActiveMedia] = useState<MediaType>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    amount: '',
    period: '',
    collateral: ''
  });
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [audioWave, setAudioWave] = useState<number[]>(new Array(20).fill(0));
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 录制计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // 模拟AI字幕流式返回
        if (recordingTime % 3 === 0 && recordingTime > 0) {
          setSubtitles(prev => [...prev, `字幕片段 ${prev.length + 1}...`]);
        }
        
        // 模拟音频波形
        if (activeMedia === 'audio') {
          setAudioWave(new Array(20).fill(0).map(() => Math.random()));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingTime, activeMedia]);

  const startRecording = async () => {
    if (activeMedia === 'video') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 720, aspectRatio: 0.5625 },
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log('模拟视频录制');
      }
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setSubtitles([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const steps = [
    { field: 'purpose', label: '资金用途', placeholder: '例如：购买农业设备、扩大种植规模' },
    { field: 'amount', label: '申请金额', placeholder: '例如：100000' },
    { field: 'period', label: '贷款期限', placeholder: '例如：12个月' },
    { field: 'collateral', label: '抵押物', placeholder: '例如：土地经营权、农机设备' }
  ];

  const isFormComplete = Object.values(formData).every(v => v.length > 0);
  const estimatedMatches = isFormComplete ? Math.floor(Math.random() * 3) + 2 : 0;

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            发布融资需求
          </h2>
          <p className="text-white/60">像发朋友圈一样简单，AI助您完善信息</p>
        </motion.div>

        {/* 媒体类型选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8 justify-center"
        >
          {[
            { type: 'video' as MediaType, icon: Video, label: '视频' },
            { type: 'audio' as MediaType, icon: Mic, label: '语音' },
            { type: 'text' as MediaType, icon: FileText, label: '图文' }
          ].map((tab) => (
            <motion.button
              key={tab.type}
              onClick={() => setActiveMedia(tab.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeMedia === tab.type
                  ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white'
                  : 'glass-morphism text-white/60'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* 媒体录制区域 */}
        <AnimatePresence mode="wait">
          {activeMedia === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-morphism rounded-2xl p-6 mb-8"
            >
              <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* 3x3网格辅助线 */}
                {isRecording && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                )}

                {/* 录制指示器 */}
                {isRecording && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2566]/80 backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-white text-sm font-mono">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </motion.div>
                )}

                {/* AI字幕 */}
                {subtitles.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm text-white text-center"
                      style={{
                        textShadow: '0 0 8px rgba(0, 214, 194, 0.8), 0 0 4px rgba(24, 255, 116, 0.6)'
                      }}
                    >
                      {subtitles[subtitles.length - 1]}
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                {!isRecording ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    开始录制
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-full bg-[#FF2566] text-white flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm bg-white" />
                    停止录制
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {activeMedia === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-morphism rounded-2xl p-8 mb-8"
            >
              {/* 音频波形 */}
              <div className="h-48 flex items-end justify-center gap-1 mb-6">
                {audioWave.map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isRecording ? `${20 + height * 80}%` : '20%'
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-2 rounded-full bg-gradient-to-t from-[#00D6C2] to-[#18FF74]"
                  />
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                {!isRecording ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    开始录音
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-full bg-[#FF2566] text-white flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-sm bg-white" />
                    停止录音
                  </motion.button>
                )}
              </div>

              {recordingTime > 0 && !isRecording && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-white/60 mt-4"
                >
                  AI正在转换为文字...
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 表单字段 - 一步一卡滑动布局 */}
        <div className="glass-morphism rounded-2xl p-6 mb-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="relative h-48 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: '100vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100vw', opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="absolute inset-0"
              >
                <label className="block mb-3 text-white">
                  {steps[currentStep].label}
                </label>
                <input
                  type="text"
                  value={formData[steps[currentStep].field as keyof FormData]}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [steps[currentStep].field]: e.target.value
                    }));
                    
                    // 自动滑入下一张
                    if (e.target.value.length > 0 && currentStep < 3) {
                      setTimeout(() => handleNext(), 500);
                    }
                  }}
                  placeholder={steps[currentStep].placeholder}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#00D6C2] transition-colors"
                />
                
                {formData[steps[currentStep].field as keyof FormData] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-12 w-6 h-6 rounded-full bg-[#18FF74] flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 rounded-lg border border-white/20 text-white/60"
              >
                上一步
              </motion.button>
            )}
            {currentStep < 3 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 px-6 py-2 rounded-lg bg-white/5 text-white/60"
              >
                下一步
              </motion.button>
            )}
          </div>
        </div>

        {/* 发布按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white overflow-hidden"
          disabled={!isFormComplete}
          style={{
            opacity: isFormComplete ? 1 : 0.5
          }}
        >
          {/* 粒子飞入效果 */}
          {isFormComplete && [...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: 0
              }}
              animate={{
                y: [-20, -60],
                opacity: [1, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.02
              }}
            />
          ))}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isFormComplete ? (
              <>
                <Sparkles className="w-5 h-5" />
                立即发布，预计匹配 {estimatedMatches} 家机构
              </>
            ) : (
              '发布需求'
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
