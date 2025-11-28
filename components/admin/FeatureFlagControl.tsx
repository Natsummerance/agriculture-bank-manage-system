import { useState } from 'react';
import { motion } from 'motion/react';
import { Flag, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  traffic: number;
  users: number;
  errorRate: number;
}

export default function FeatureFlagControl() {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'ai-match',
      name: 'AI智能匹配v2.0',
      description: '新一代AI匹配算法，提升匹配准确度30%',
      enabled: true,
      traffic: 50,
      users: 6271,
      errorRate: 0.2,
    },
    {
      id: 'blockchain-v2',
      name: '区块链存证v2.0',
      description: '升级的区块链存证系统，TPS提升10倍',
      enabled: false,
      traffic: 10,
      users: 1254,
      errorRate: 0.1,
    },
    {
      id: 'video-consult',
      name: '视频咨询功能',
      description: '支持专家视频咨询，提升用户体验',
      enabled: true,
      traffic: 80,
      users: 10034,
      errorRate: 0.5,
    },
  ]);

  // Mock real-time data
  const realtimeData = [
    { time: '10:00', users: 120, errors: 2 },
    { time: '10:15', users: 145, errors: 1 },
    { time: '10:30', users: 180, errors: 3 },
    { time: '10:45', users: 165, errors: 2 },
    { time: '11:00', users: 195, errors: 1 },
    { time: '11:15', users: 220, errors: 4 },
    { time: '11:30', users: 210, errors: 2 },
  ];

  const handleToggle = (featureId: string) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    const feature = features.find(f => f.id === featureId);
    toast.success(`${feature?.name} 已${feature?.enabled ? '关闭' : '开启'}`);
  };

  const handleTrafficChange = (featureId: string, value: number[]) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, traffic: value[0] } : f
    ));
  };

  const handleTrafficCommit = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    toast.success(`${feature?.name} 流量已调整至 ${feature?.traffic}%`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0D] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 flex items-center gap-2">
            <Flag className="w-6 h-6 text-[#00D6C2]" />
            功能灰度发布控制台
          </h1>
          <p className="text-white/60">实时监控新功能表现，精准控制发布流量</p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-white">{feature.name}</h3>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => handleToggle(feature.id)}
                    />
                  </div>
                  <p className="text-sm text-white/60 mb-3">{feature.description}</p>
                </div>
              </div>

              {feature.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {/* Traffic Control */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">流量控制</span>
                      <span className="text-sm text-[#00D6C2]">{feature.traffic}%</span>
                    </div>
                    <Slider
                      value={[feature.traffic]}
                      onValueChange={(value) => handleTrafficChange(feature.id, value)}
                      onValueCommit={() => handleTrafficCommit(feature.id)}
                      max={100}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>0%</span>
                      <span>全量发布</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#00D6C2]/10 to-[#00D6C2]/5 border border-[#00D6C2]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-[#00D6C2]" />
                        <span className="text-xs text-white/60">使用用户</span>
                      </div>
                      <p className="text-lg text-white">{feature.users.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#18FF74]/10 to-[#18FF74]/5 border border-[#18FF74]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-[#18FF74]" />
                        <span className="text-xs text-white/60">流量占比</span>
                      </div>
                      <p className="text-lg text-white">{feature.traffic}%</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      feature.errorRate > 0.3
                        ? 'bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20'
                        : 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className={`w-4 h-4 ${
                          feature.errorRate > 0.3 ? 'text-red-400' : 'text-blue-400'
                        }`} />
                        <span className="text-xs text-white/60">错误率</span>
                      </div>
                      <p className={`text-lg ${
                        feature.errorRate > 0.3 ? 'text-red-400' : 'text-white'
                      }`}>
                        {feature.errorRate}%
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleTrafficChange(feature.id, [0]);
                        handleTrafficCommit(feature.id);
                      }}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                    >
                      紧急回滚
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleTrafficChange(feature.id, [100]);
                        handleTrafficCommit(feature.id);
                      }}
                      className="bg-[#18FF74]/20 text-[#18FF74] hover:bg-[#18FF74]/30 border border-[#18FF74]/30"
                    >
                      全量发布
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Real-time Monitoring */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00D6C2]" />
            实时监控数据
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0D',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#00D6C2"
                  strokeWidth={2}
                  dot={{ fill: '#00D6C2', r: 4 }}
                  name="活跃用户"
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="#FF2566"
                  strokeWidth={2}
                  dot={{ fill: '#FF2566', r: 4 }}
                  name="错误数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
