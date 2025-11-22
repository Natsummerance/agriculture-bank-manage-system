import { useRef, useState } from "react";
import { motion } from "motion/react";
import { FileText, PenTool, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

export default function FinanceContractSign() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#18FF74";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const handlePointerUp = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    toast.success("签名已清空");
  };

  const handleSign = () => {
    if (!hasSignature) {
      toast.error("请先完成签名");
      return;
    }
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      toast.success("合同签署成功！");
      navigateToSubRoute("finance", "list");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              电子合同签署
            </h2>
            <p className="text-sm text-white/60">
              请在下方签名框内使用鼠标或触控板进行手写签名
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("finance", "list")}
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            返回列表
          </Button>
        </motion.div>

        {/* 合同预览 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">合同预览</h3>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A0F1E] p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4 text-sm text-white/80">
              <h4 className="text-lg font-semibold text-white mb-4">融资合同</h4>
              <p>
                本合同由农户（甲方）与银行（乙方）就融资事项达成如下协议：
              </p>
              <div className="space-y-2 pl-4">
                <p>1. 融资金额：根据申请金额确定</p>
                <p>2. 融资期限：根据申请期限确定</p>
                <p>3. 还款方式：按照双方约定的还款计划执行</p>
                <p>4. 利率：按照银行产品利率执行</p>
                <p>5. 其他条款：详见完整合同文件</p>
              </div>
              <p className="pt-4 text-white/60">
                请仔细阅读合同内容，确认无误后请在下方签名。
              </p>
            </div>
          </div>
        </motion.section>

        {/* 签名区域 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <PenTool className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">签名区域</h3>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full rounded-xl border-2 border-dashed border-[#00D6C2]/30 bg-[#0A0F1E] cursor-crosshair"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <PenTool className="w-12 h-12 mx-auto mb-2 text-white/20" />
                  <p className="text-white/40">请在此处签名</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!hasSignature}
              className="border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              清空重签
            </Button>
            <div className="flex-1" />
            <Button
              onClick={handleSign}
              disabled={!hasSignature || isSigning}
              className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90 disabled:opacity-50"
            >
              {isSigning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full"
                  />
                  签署中...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  确认签署
                </>
              )}
            </Button>
          </div>
        </motion.section>

        {/* 提示信息 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass-morphism border border-amber-400/30 bg-amber-400/10 p-6 flex items-start gap-4"
        >
          <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-white mb-2">签署须知</div>
            <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
              <li>请使用鼠标或触控板在签名框内完成手写签名</li>
              <li>签名完成后，点击"确认签署"按钮完成合同签署</li>
              <li>签署后的合同具有法律效力，请谨慎操作</li>
              <li>如有疑问，请联系客服或银行工作人员</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
