import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mic, Image as ImageIcon, Paperclip, Smile, Phone, Video, MoreVertical, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'text' | 'image' | 'voice' | 'product' | 'file';
  content: string;
  sender: 'user' | 'expert';
  time: string;
  duration?: number; // for voice
  productData?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  imageUrl?: string;
  fileUrl?: string;
  fileSize?: string;
}

interface ConsultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  isOnline: boolean;
  onBooking?: () => void; // 可选的预约回调
}

const shortcuts = [
  '产品质量如何？',
  '什么时候发货？',
  '支持退换货吗？',
  '有优惠吗？',
  '可以议价吗？',
];

export default function ConsultDialog({
  isOpen,
  onClose,
  expertId,
  expertName,
  expertAvatar,
  isOnline,
  onBooking,
}: ConsultDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: '您好！我是农业专家张老师，请问有什么可以帮助您的？',
      sender: 'expert',
      time: '10:30',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Mock expert reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: '收到您的消息，让我为您详细解答...',
        sender: 'expert',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleShortcut = (text: string) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    recordTimer.current = setInterval(() => {
      setRecordDuration(prev => {
        if (prev >= 60) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
    toast.success('开始录音...');
  };

  const stopRecording = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
    }
    if (recordDuration > 0) {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'voice',
        content: '语音消息',
        sender: 'user',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        duration: recordDuration,
      };
      setMessages(prev => [...prev, voiceMessage]);
      toast.success('语音发送成功');
    }
    setIsRecording(false);
    setRecordDuration(0);
  };

  const cancelRecording = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
    }
    setIsRecording(false);
    setRecordDuration(0);
    toast('录音已取消');
  };

  const handleImageUpload = () => {
    // 模拟图片上传
    const mockImageUrl = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300';
    const imageMessage: Message = {
      id: Date.now().toString(),
      type: 'image',
      content: '[图片]',
      sender: 'user',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: mockImageUrl
    };
    setMessages(prev => [...prev, imageMessage]);
    toast.success('图片上传成功');
  };

  const handleFileUpload = () => {
    // 模拟文件上传
    const mockFile = {
      name: '农产品质检报告.pdf',
      size: '2.5MB'
    };
    const fileMessage: Message = {
      id: Date.now().toString(),
      type: 'file',
      content: mockFile.name,
      sender: 'user',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      fileUrl: '#',
      fileSize: mockFile.size
    };
    setMessages(prev => [...prev, fileMessage]);
    toast.success('文件上传成功');
  };

  const handleBooking = () => {
    if (onBooking) {
      toast.success('正在跳转到专家预约页面...');
      setTimeout(() => {
        onClose();
        onBooking();
      }, 500);
    } else {
      toast.info('预约专家视频咨询', {
        description: '请前往"知识星系"页面预约专家',
        duration: 3000
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#0A0A0D] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#00D6C2]/10 to-[#18FF74]/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={expertAvatar}
                alt={expertName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#18FF74] border-2 border-[#0A0A0D]" />
              )}
            </div>
            <div>
              <h3 className="text-white">{expertName}</h3>
              <p className="text-xs text-white/50">
                {isOnline ? '在线' : '离线'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] text-[#0A0A0D]'
                      : 'bg-white/10 text-white'
                  } rounded-2xl p-3`}
                >
                  {message.type === 'text' && (
                    <p className="text-sm break-words">{message.content}</p>
                  )}
                  {message.type === 'image' && message.imageUrl && (
                    <div className="space-y-2">
                      <img
                        src={message.imageUrl}
                        alt={message.content || 'image message'}
                        className="w-full rounded-xl object-cover"
                      />
                      {message.content && <p className="text-sm break-words">{message.content}</p>}
                    </div>
                  )}
                  {message.type === 'file' && (
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                      <Paperclip className="w-4 h-4" />
                      <div className="text-sm">
                        <p>{message.content}</p>
                        {message.fileSize && <span className="text-xs opacity-70">{message.fileSize}</span>}
                      </div>
                    </div>
                  )}
                  {message.type === 'voice' && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Mic className="w-3 h-3" />
                      </div>
                      <div className="flex-1 h-6 bg-white/10 rounded-full" />
                      <span className="text-xs">{message.duration}"</span>
                    </div>
                  )}
                  <div className="text-xs opacity-60 mt-1">{message.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Shortcuts */}
        <div className="px-4 py-2 border-t border-white/5">
          <div className="flex gap-2 flex-wrap">
            {shortcuts.map((shortcut, index) => (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                onClick={() => handleShortcut(shortcut)}
                className="text-xs h-7 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                {shortcut}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-[#0A0A0D]">
          {isRecording ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
                >
                  <Mic className="w-5 h-5 text-red-500" />
                </motion.div>
                <span className="text-white">{recordDuration}s</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={cancelRecording}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D]"
                >
                  发送
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onMouseDown={startRecording}
                  className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleImageUpload}
                  className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFileUpload}
                  className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleBooking}
                  className="ml-auto h-9 px-3 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2] border border-[#00D6C2]/30 hover:bg-[#00D6C2]/30"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  预约专家
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
