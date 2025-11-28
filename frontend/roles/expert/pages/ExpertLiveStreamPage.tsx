import { useState, useRef, useEffect, useMemo } from "react";
import { Zap, Camera, Mic, MessageSquare, Loader2 } from "lucide-react";
import { motion } from "motion/react";

// 定义组件属性，使其能够接收 mode 和 params
interface ExpertLiveStreamPageProps {
  mode?: "publish" | "join";
  params?: string; // 从 URL 传递的参数字符串，例如 "appointmentId=1"
}

export default function ExpertLiveStreamPage({ mode = "publish", params }: ExpertLiveStreamPageProps) {
  // 识别当前角色模式
  const isPublisher = mode === "publish"; 
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(isPublisher); // 默认专家麦克风开，农户麦克风关
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(isPublisher ? "等待开始" : "正在连接...");
  
  const videoRef = useRef<HTMLVideoElement | null>(null); 
  
  // 解析参数，例如获取 appointmentId
  const parsedParams = useMemo(() => {
      const p = new URLSearchParams(params || "");
      return {
          appointmentId: p.get("appointmentId") || null,
          roomId: p.get("roomId") || "expert-default-room", // 使用预约ID作为房间ID
      };
  }, [params]);


  // 【核心 WebRTC 逻辑：根据模式切换行为】
  useEffect(() => {
    // 如果不是推流中，且不是加入模式，则不执行任何操作
    if (!isStreaming && mode === 'publish') return;
    if (mode === 'join' && !parsedParams.roomId) return; 

    // 清理函数
    const cleanup = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
      setConnectionStatus("连接已断开");
      // TODO: 关闭 WebRTC 连接 (RTCPeerConnection.close())
    };

    // 1. 推流（专家）逻辑
    if (isPublisher && isStreaming) {
      setIsLoading(true);
      setConnectionStatus("正在获取媒体权限...");
      
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream; 
            videoRef.current.play();
            
            // TODO: 调用 WebRTC SDK 开始推流到 parsedParams.roomId
            console.log(`[PUBLISHER] Local stream established. Pushing to Room: ${parsedParams.roomId}`);
            setConnectionStatus("LIVE: 正在推流");
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error("无法获取媒体权限或开启推流:", err);
          setConnectionStatus("错误: 权限被拒绝");
          setIsStreaming(false);
          setIsLoading(false);
        });
    } 
    
    // 2. 观看（农户）逻辑
    else if (mode === 'join' && parsedParams.roomId) {
        // 农户不需要用户操作开始，只要页面加载就尝试连接
        setIsLoading(true);
        setConnectionStatus(`正在加入会议室: ${parsedParams.roomId}...`);
        
        // TODO: 调用 WebRTC SDK/信令服务器，订阅 parsedParams.roomId 的流
        console.log(`[SUBSCRIBER] Attempting to subscribe to Room: ${parsedParams.roomId}`);
        
        // 模拟订阅成功，获取远程流
        // 实际应用中，这里需要通过 WebRTC 信令获取远程 PeerConnection
        setTimeout(() => {
            // 假设我们从 WebRTC 接收到了远程流 (remoteStream)
            // if (videoRef.current) {
            //     videoRef.current.srcObject = remoteStream;
            //     videoRef.current.play();
            //     setConnectionStatus("观看中");
            //     setIsLoading(false);
            // }
            
            // 临时演示：如果 Expert 没开播，显示等待
            setConnectionStatus("等待专家开播...");
            setIsLoading(false);

        }, 3000);
    } 

    // 停止逻辑
    if (!isStreaming && isPublisher) {
        cleanup();
    }
    
    // 返回清理函数
    return cleanup;
  }, [isStreaming, isPublisher, mode, parsedParams.roomId]);


  // 仅在专家模式下可用
  const toggleStreaming = () => {
    setIsStreaming(prev => !prev);
  }


  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold border-b border-pink-600/50 pb-2">
          {isPublisher ? (
            <Zap className="inline w-7 h-7 mr-2 text-pink-500" /> 
          ) : (
            <MessageSquare className="inline w-7 h-7 mr-2 text-[#00D6C2]" /> 
          )}
          {isPublisher ? "专家实时推流工作台" : `预约会议室 (ID: ${parsedParams.appointmentId || 'N/A'})`}
        </h1>

        <div className="rounded-xl overflow-hidden glass-morphism border border-white/10 relative">
          <video 
            ref={videoRef} 
            autoPlay 
            muted={isPublisher ? !isMicOn : false} // 专家自看时静音，农户观看时不需要静音
            className="w-full h-auto max-h-[70vh] object-contain bg-black"
          />
          
          {/* 状态 & 加载 Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
             {isLoading && <Loader2 className="w-8 h-8 text-white animate-spin" />}
             {!isLoading && (
                 <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    isStreaming && isPublisher ? 'bg-red-600 animate-pulse' : 
                    connectionStatus.startsWith('错误') ? 'bg-red-800' : 
                    'bg-gray-500'
                 }`}>
                     {isStreaming && isPublisher ? 'LIVE' : connectionStatus}
                 </div>
             )}
          </div>
          
          {/* 控制条 (仅专家模式下显示) */}
          {isPublisher && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 p-3 rounded-full bg-black/70">
              <button 
                onClick={toggleStreaming}
                className={`p-3 rounded-full transition-colors ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                title={isStreaming ? "停止直播" : "开始推流"}
                disabled={isLoading}
              >
                <Zap className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-600'}`}
                title={isMicOn ? "关闭麦克风" : "开启麦克风"}
                disabled={!isStreaming || isLoading}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                className="p-3 rounded-full bg-white/20 hover:bg-white/30"
                title="切换摄像头/屏幕共享"
                disabled={!isStreaming || isLoading}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* 右侧：聊天/问答区（保持不变，但可以根据模式显示不同内容） */}
        <div className="rounded-xl glass-morphism border border-white/10 bg-white/5 flex flex-col h-[30vh]">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold">{isPublisher ? "实时互动问答区" : "会议室聊天"}</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3">
              <p className="text-sm text-white/70">{isPublisher ? "农户消息将实时显示在这里..." : "连接专家中，请等待..."}</p>
              {/* TODO: 聊天渲染逻辑 */}
            </div>
            {/* 农户或专家都可以发消息 */}
            <div className="p-4 border-t border-white/10">
              <input 
                type="text" 
                placeholder={isPublisher ? "发送公告或回复农户..." : "发送消息..."}
                className="w-full p-2 rounded-lg bg-white/10 border-none text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        
      </motion.div>
    </div>
  );
}