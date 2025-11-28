import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Users, Filter, Calendar, Eye, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function PushNotification() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [image, setImage] = useState<string | null>(null);

  const roles = [
    { id: 'farmer', label: '农户', count: 12543 },
    { id: 'buyer', label: '买家', count: 8932 },
    { id: 'expert', label: '专家', count: 234 },
    { id: 'bank', label: '银行', count: 45 },
  ];

  const toggleRole = (roleId: string) => {
    setTargetRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const totalUsers = roles
    .filter(role => targetRoles.includes(role.id))
    .reduce((sum, role) => sum + role.count, 0);

  const handleSend = () => {
    if (!title || !content) {
      toast.error('请输入标题和内容');
      return;
    }
    if (targetRoles.length === 0) {
      toast.error('请选择目标用户群体');
      return;
    }

    if (scheduleDate) {
      toast.success(`推送已定时至 ${format(scheduleDate, 'PPP', { locale: zhCN })}`);
    } else {
      toast.success(`正在向 ${totalUsers.toLocaleString()} 位用户发送推送...`);
      setTimeout(() => {
        toast.success('推送发送成功！');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0D] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2">推送通知管理</h1>
          <p className="text-white/60">创建并发送推送通知给特定用户群体</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white mb-2">推送标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入推送标题"
              maxLength={50}
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all"
            />
            <p className="text-xs text-white/40 mt-1">{title.length}/50</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-white mb-2">推送内容 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入推送内容，支持换行"
              maxLength={200}
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all resize-none"
            />
            <p className="text-xs text-white/40 mt-1">{content.length}/200</p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-white mb-2">推送图片 (可选)</label>
            {image ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden">
                <img src={image} alt="" className="w-full h-full object-cover" />
                <Button
                  size="sm"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-red-500/80 hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setImage('https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600')}
                className="w-full h-40 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">点击上传图片</span>
              </button>
            )}
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-white mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                目标用户群体 *
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleRole(role.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    targetRoles.includes(role.id)
                      ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-[#00D6C2]/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{role.label}</span>
                    <Checkbox
                      checked={targetRoles.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                  </div>
                  <p className="text-sm text-white/60">
                    {role.count.toLocaleString()} 位用户
                  </p>
                </motion.div>
              ))}
            </div>
            {totalUsers > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg bg-gradient-to-r from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/30"
              >
                <p className="text-sm text-[#00D6C2]">
                  将发送给 <span className="font-bold">{totalUsers.toLocaleString()}</span> 位用户
                </p>
              </motion.div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-white mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                定时发送 (可选)
              </div>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Calendar className="w-5 h-5 mr-2 text-white/40" />
                  {scheduleDate ? (
                    format(scheduleDate, 'PPP HH:mm', { locale: zhCN })
                  ) : (
                    <span className="text-white/40">立即发送</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0A0A0D] border-white/10">
                <CalendarComponent
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
                {scheduleDate && (
                  <div className="p-3 border-t border-white/10">
                    <Button
                      size="sm"
                      onClick={() => setScheduleDate(undefined)}
                      className="w-full bg-white/5 text-white hover:bg-white/10"
                    >
                      清除定时
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button
              onClick={handleSend}
              disabled={!title || !content || targetRoles.length === 0}
              className="flex-1 h-12 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {scheduleDate ? '定时发送' : '立即发送'}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            推送预览
          </h3>
          <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/10">
            {image && (
              <img src={image} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <h4 className="text-white mb-2">{title || '推送标题'}</h4>
            <p className="text-sm text-white/60 whitespace-pre-line">
              {content || '推送内容将在这里显示...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
