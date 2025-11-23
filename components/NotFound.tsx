import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* 404 图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] mb-4"
        >
          <AlertCircle className="w-12 h-12 text-black" />
        </motion.div>

        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
        >
          404
        </motion.h1>

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/80"
        >
          页面未找到
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/60"
        >
          抱歉，您访问的页面不存在或已被移除。
        </motion.p>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center pt-4"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上一页
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
          >
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

