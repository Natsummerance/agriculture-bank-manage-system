import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { FileText, CheckCircle, Hash, RefreshCw, Sparkles, Shield, Download } from "lucide-react";

interface Point {
  x: number;
  y: number;
  timestamp: number;
  pressure?: number;
}

interface SignatureTrail extends Point {
  life: number;
}

interface ContractData {
  id: string;
  title: string;
  amount: string;
  rate: string;
  term: string;
  date: string;
  parties: {
    borrower: string;
    lender: string;
  };
}

const mockContract: ContractData = {
  id: "CNT-2025-001238",
  title: "农业生产贷款合同",
  amount: "¥350,000",
  rate: "3.85%",
  term: "36个月",
  date: "2025-10-31",
  parties: {
    borrower: "张三（农户）",
    lender: "某农业银行某支行"
  }
};

export function ContractSigning() {
  const [stage, setStage] = useState<'reading' | 'signing' | 'processing' | 'completed'>('reading');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureData, setSignatureData] = useState<Point[]>([]);
  const [blockchainHash, setBlockchainHash] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const signatureTrails = useRef<SignatureTrail[]>([]);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化音频上下文
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 离子尾迹动画循环
  useEffect(() => {
    if (!trailCanvasRef.current || stage !== 'signing') return;

    const canvas = trailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新并绘制所有尾迹粒子
      signatureTrails.current = signatureTrails.current.filter(trail => {
        trail.life -= 0.03;
        
        if (trail.life > 0) {
          const size = 3 * trail.life;
          const gradient = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, size * 2);
          gradient.addColorStop(0, `rgba(0, 214, 194, ${trail.life * 0.8})`);
          gradient.addColorStop(0.5, `rgba(24, 255, 116, ${trail.life * 0.5})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // 添加闪光效果
          if (trail.life > 0.7) {
            ctx.fillStyle = `rgba(255, 255, 255, ${trail.life * 0.3})`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          return true;
        }
        return false;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stage]);

  // 播放太空笔"嗖"声
  const playSpaceSound = (x: number, y: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    // 根据x位置计算立体声定位 (-1到1)
    if (canvasRef.current) {
      panNode.pan.value = (x / canvasRef.current.width) * 2 - 1;
    }

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };

  // 开始签名
  const startSigning = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (stage !== 'signing') return;
    setIsSigning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e 
      ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
      : { x: e.clientX - rect.left, y: e.clientY - rect.top };

    setSignatureData([{ ...point, timestamp: Date.now() }]);
    
    playSpaceSound(point.x, point.y);
  };

  // 签名中
  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSigning || stage !== 'signing') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e
      ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
      : { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const newPoint = { ...point, timestamp: Date.now() };
    
    // 绘制主签名线
    if (signatureData.length > 0) {
      const lastPoint = signatureData[signatureData.length - 1];
      
      ctx.strokeStyle = '#00D6C2';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.9;
      
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(newPoint.x, newPoint.y);
      ctx.stroke();

      // 添加发光效果
      ctx.strokeStyle = 'rgba(0, 214, 194, 0.3)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // 创建离子尾迹粒子
      const distance = Math.sqrt(
        Math.pow(newPoint.x - lastPoint.x, 2) + Math.pow(newPoint.y - lastPoint.y, 2)
      );
      
      const particleCount = Math.ceil(distance / 5);
      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        signatureTrails.current.push({
          x: lastPoint.x + (newPoint.x - lastPoint.x) * t,
          y: lastPoint.y + (newPoint.y - lastPoint.y) * t,
          timestamp: Date.now(),
          life: 1.0
        });
      }
    }

    setSignatureData(prev => [...prev, newPoint]);
    
    // 每隔几个点播放一次声音
    if (signatureData.length % 5 === 0) {
      playSpaceSound(point.x, point.y);
    }
  };

  // 结束签名
  const endSigning = () => {
    setIsSigning(false);
  };

  // 清除签名
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData([]);
    signatureTrails.current = [];
  };

  // 确认签名并上链
  const confirmSignature = async () => {
    if (signatureData.length < 10) {
      alert('请完成签名');
      return;
    }

    setStage('processing');
    setIsUploading(true);

    // 模拟区块链上链过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成模拟哈希
    const hash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    setBlockchainHash(hash);
    setIsUploading(false);

    await new Promise(resolve => setTimeout(resolve, 800));
    setStage('completed');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* 阶段1: 合同阅读 */}
          {stage === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-block p-4 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 mb-4"
                >
                  <FileText className="w-12 h-12 text-[#00D6C2]" />
                </motion.div>
                <h2 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                  合同签署舱
                </h2>
                <p className="text-white/60">请仔细阅读合同条款</p>
              </div>

              {/* 合同内容 */}
              <div className="glass-morphism rounded-2xl p-8 space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="mb-2">{mockContract.title}</h3>
                    <p className="text-sm text-white/60">合同编号：{mockContract.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">签署日期</p>
                    <p className="font-mono">{mockContract.date}</p>
                  </div>
                </div>

                {/* 合同关键信息 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">贷款金额</p>
                    <p className="text-2xl font-mono text-[#00D6C2]">{mockContract.amount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">年化利率</p>
                    <p className="text-2xl font-mono text-[#18FF74]">{mockContract.rate}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">贷款期限</p>
                    <p className="text-2xl font-mono">{mockContract.term}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-white/60 mb-1">还款方式</p>
                    <p className="text-xl">等额本息</p>
                  </div>
                </div>

                {/* 合同当事人 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/60">借款人</span>
                    <span>{mockContract.parties.borrower}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/60">贷款人</span>
                    <span>{mockContract.parties.lender}</span>
                  </div>
                </div>

                {/* 合同条款（模拟） */}
                <div className="p-6 rounded-lg bg-white/5 max-h-64 overflow-y-auto text-sm space-y-3 text-white/80">
                  <p><strong>第一条 借款用途</strong></p>
                  <p>本合同项下贷款专用于农业生产经营活动，包括但不限于购买种子、化肥、农药及农机具等...</p>
                  
                  <p><strong>第二条 借款期限</strong></p>
                  <p>借款期限为{mockContract.term}，自放款日起计算。借款到期日为实际放款日后{mockContract.term}对应的日期...</p>
                  
                  <p><strong>第三条 借款利率</strong></p>
                  <p>本合同项下贷款利率为年化{mockContract.rate}，按月计息，利随本清...</p>

                  <p><strong>第四条 还款方式</strong></p>
                  <p>借款人应按等额本息方式按月偿还本息，每月还款日为放款日对应日期...</p>

                  <p><strong>第五条 违约责任</strong></p>
                  <p>借款人未按约定用途使用贷款或未按期还款的，贷款人有权提前收回贷款并要求支付违约金...</p>

                  <p><strong>第六条 争议解决</strong></p>
                  <p>因本合同引起的争议，双方应协商解决；协商不成的，提交贷款人所在地人民法院诉讼解决...</p>
                </div>

                {/* 同意条款 */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/20">
                  <input
                    type="checkbox"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-[#00D6C2] bg-transparent"
                  />
                  <label className="text-sm text-white/80 cursor-pointer" onClick={() => setHasAgreed(!hasAgreed)}>
                    我已仔细阅读并同意本合同的所有条款，理解合同内容及法律后果。本合同签署后将上传至区块链存证，具有法律效力。
                  </label>
                </div>
              </div>

              {/* 下一步按钮 */}
              <motion.button
                whileHover={{ scale: hasAgreed ? 1.02 : 1 }}
                whileTap={{ scale: hasAgreed ? 0.98 : 1 }}
                disabled={!hasAgreed}
                onClick={() => setStage('signing')}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  hasAgreed
                    ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white cursor-pointer'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                进入签署舱
              </motion.button>
            </motion.div>
          )}

          {/* 阶段2: 太空笔签名 */}
          {stage === 'signing' && (
            <motion.div
              key="signing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block p-4 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 mb-4"
                >
                  <Sparkles className="w-12 h-12 text-[#18FF74]" />
                </motion.div>
                <h2 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                  太空笔签名
                </h2>
                <p className="text-white/60">在下方区域签署您的姓名 · 支持鼠标/触摸屏</p>
              </div>

              {/* 签名画布容器 */}
              <div className="glass-morphism rounded-2xl p-8">
                <div className="relative">
                  {/* 签名提示 */}
                  {signatureData.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✍️
                        </motion.div>
                        <p className="text-white/40 mt-2">请在此处签名</p>
                      </div>
                    </motion.div>
                  )}

                  {/* 离子尾迹层 */}
                  <canvas
                    ref={trailCanvasRef}
                    width={800}
                    height={300}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />

                  {/* 主签名画布 */}
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    onMouseDown={startSigning}
                    onMouseMove={drawSignature}
                    onMouseUp={endSigning}
                    onMouseLeave={endSigning}
                    onTouchStart={startSigning}
                    onTouchMove={drawSignature}
                    onTouchEnd={endSigning}
                    className="relative w-full h-[300px] border-2 border-dashed border-[#00D6C2]/30 rounded-lg cursor-crosshair bg-black/20"
                    style={{ touchAction: 'none' }}
                  />
                </div>

                {/* 签名操作按钮 */}
                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSignature}
                    className="flex-1 py-3 rounded-lg border border-[#FF2566] text-[#FF2566] flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新签名
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmSignature}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    确认签名
                  </motion.button>
                </div>
              </div>

              {/* 安全提示 */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
                <Shield className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/80">
                  <p className="mb-1">🔒 区块链安全存证</p>
                  <p className="text-white/60">您的签名将通过SHA-256加密后上传至Polygon zkEVM区块链，确保合同不可篡改、可追溯。</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 阶段3: 区块链上链中 */}
          {stage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 border-transparent border-t-[#00D6C2] border-r-[#18FF74] mb-8"
              />
              
              <h3 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                {isUploading ? '正在上链...' : '生成存证哈希...'}
              </h3>
              
              <div className="flex items-center gap-2 text-white/60">
                <Hash className="w-5 h-5" />
                <p className="font-mono text-sm">
                  {blockchainHash || '计算中...'}
                </p>
              </div>

              {/* 上链进度粒子 */}
              <div className="mt-8 flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 阶段4: 签署完成 */}
          {stage === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* 成功动画 */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block relative"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(24, 255, 116, 0.4)',
                        '0 0 0 30px rgba(24, 255, 116, 0)',
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                  <div className="relative p-6 rounded-full bg-gradient-to-br from-[#18FF74]/20 to-[#00D6C2]/20">
                    <CheckCircle className="w-16 h-16 text-[#18FF74]" />
                  </div>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                >
                  签署成功！
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/60"
                >
                  合同已上链存证，具有法律效力
                </motion.p>
              </div>

              {/* 区块链存证信息 */}
              <div className="glass-morphism rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="p-2 rounded-lg bg-[#FFD700]/20">
                    <Hash className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h4>区块链存证凭证</h4>
                    <p className="text-sm text-white/60">Polygon zkEVM Network</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black/40 border border-[#00D6C2]/20">
                    <p className="text-xs text-white/60 mb-2">交易哈希（Transaction Hash）</p>
                    <p className="font-mono text-sm text-[#00D6C2] break-all">{blockchainHash}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-xs text-white/60 mb-1">区块高度</p>
                      <p className="font-mono text-[#18FF74]">#{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-xs text-white/60 mb-1">Gas费用</p>
                      <p className="font-mono text-[#FFD700]">0.00 MATIC</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">上链时间</p>
                    <p className="font-mono">{new Date().toLocaleString('zh-CN')}</p>
                  </div>
                </div>

                {/* 查看区块链浏览器 */}
                <motion.a
                  href={`https://zkevm.polygonscan.com/tx/${blockchainHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-3 rounded-lg border border-[#00D6C2] text-[#00D6C2] text-center"
                >
                  在区块链浏览器中查看 →
                </motion.a>
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-4 rounded-lg border border-white/20 text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载合同PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStage('reading');
                    setHasAgreed(false);
                    clearSignature();
                    setBlockchainHash("");
                  }}
                  className="py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  完成
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
