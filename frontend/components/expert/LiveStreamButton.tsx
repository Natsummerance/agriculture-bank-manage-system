// src/components/expert/LiveStreamButton.tsx

import { Zap } from "lucide-react";
import { Button } from "../ui/button";
// 确保这个路径正确
import { navigateToSubRoute } from "../../utils/subRouteNavigation"; 
import { motion } from "motion/react";

export default function LiveStreamButton() { 
  const handleStartStream = () => {
    // ⚡ 关键日志：检查点击是否被捕获
    console.log("--- LIVE STREAM BUTTON CLICKED! Attempting navigation... ---"); 
    
    // 导航函数
    navigateToSubRoute("expert", "live"); 
  };

  return (
    // ... (JSX 保持不变)
    <motion.div
    // ...
    >
      <Button
        className="w-full h-12 text-lg font-bold bg-pink-600 hover:bg-pink-700 transition-all duration-300 shadow-xl shadow-pink-900/50"
        onClick={handleStartStream}
      >
        <Zap className="w-5 h-5 mr-3 animate-pulse" />
        进入专家直播间
      </Button>
    </motion.div>
  );
}