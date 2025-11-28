/**
 * 五角色空间站登录舱
 * 差异化主题 + 专属交互
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Lock,
  Mail,
  Phone,
  Key,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { login, register, sendVerificationCode, type LoginRequest, type RegisterRequest } from "../../api/auth";
import { useRole } from "../../contexts/RoleContext";
import { rolePermissions } from "../../config/permissions";

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

interface RoleStationProps {
  role: RoleType;
  onLogin: (data: any) => void;
  onBack: () => void;
}

const stationConfig = {
  farmer: {
    title: '晨露·生态舱',
    subtitle: 'Farmer Eco Station',
    theme: 'from-[#18FF74]/20 to-[#00D6C2]/10',
    primaryColor: '#18FF74',
    icon: '🌾',
    background: 'linear-gradient(135deg, rgba(24, 255, 116, 0.05), rgba(0, 214, 194, 0.02))',
    feature: '数字稻田生长动画'
  },
  buyer: {
    title: '都市·购汇舱',
    subtitle: 'Buyer Commerce Station',
    theme: 'from-[#00D6C2]/20 to-[#18FF74]/10',
    primaryColor: '#00D6C2',
    icon: '🛒',
    background: 'linear-gradient(135deg, rgba(0, 214, 194, 0.05), rgba(24, 255, 116, 0.02))',
    feature: '城市霓虹扫描线'
  },
  bank: {
    title: '量子·金库舱',
    subtitle: 'Bank Quantum Vault',
    theme: 'from-[#FFD700]/20 to-[#FF8C00]/10',
    primaryColor: '#FFD700',
    icon: '🏦',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 140, 0, 0.02))',
    feature: '金库门旋转开启'
  },
  expert: {
    title: '知识·轨道舱',
    subtitle: 'Expert Knowledge Orbit',
    theme: 'from-[#FF2566]/20 to-[#FF6B9D]/10',
    primaryColor: '#FF2566',
    icon: '👨‍🔬',
    background: 'linear-gradient(135deg, rgba(255, 37, 102, 0.05), rgba(255, 107, 157, 0.02))',
    feature: '环形书架旋转'
  },
  admin: {
    title: '核心·控制舱',
    subtitle: 'Admin Control Core',
    theme: 'from-[#9D4EDD]/20 to-[#C77DFF]/10',
    primaryColor: '#9D4EDD',
    icon: '⚙️',
    background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.05), rgba(199, 125, 255, 0.02))',
    feature: '3D拓扑实时旋转'
  }
};

export function RoleStation({ role, onLogin, onBack }: RoleStationProps) {
  const navigate = useNavigate();
  const { 
    resetRoleState, 
    setRole, 
    setUserProfile, 
    setPermissions, 
    setToken,
    role: currentRole,
    token: currentToken,
    permissions: currentPermissions
  } = useRole();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    code: '',
    password: '',
    inviteCode: ''
  });
  // 字段级别的错误信息
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // 用于存储注册/登录成功后的导航路径
  const pendingNavigation = useRef<string | null>(null);
  // 用于存储倒计时timer，确保可以正确清理
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 确保 role 是有效的，如果不是则使用 farmer 作为默认值
  const validRole: RoleType = (role && ['farmer', 'buyer', 'bank', 'expert', 'admin'].includes(role)) 
    ? role 
    : 'farmer';
  const config = stationConfig[validRole] || stationConfig.farmer; // 双重保护，确保 config 不为 undefined

  // 清理倒计时timer
  const clearCountdownTimer = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  // 当权限和token都设置好后，执行导航
  useEffect(() => {
    console.log('导航检查:', {
      pendingNavigation: pendingNavigation.current,
      currentToken: !!currentToken,
      currentRole,
      permissionsLength: currentPermissions.length
    });
    
    // 检查导航条件：pendingNavigation 存在，且有 token 和 role
    // 权限可以为空（某些情况下可能没有权限，但仍然可以导航）
    if (pendingNavigation.current && currentToken && currentRole) {
      const path = pendingNavigation.current;
      console.log('准备导航到:', path, '权限数量:', currentPermissions.length);
      pendingNavigation.current = null;
      // 使用 setTimeout 确保状态已完全更新
      setTimeout(() => {
        console.log('执行导航到:', path);
        navigate(path);
      }, 100); // 增加延迟，确保状态完全更新
    }
  }, [currentToken, currentRole, currentPermissions.length, navigate]);

  // 组件卸载时清理倒计时timer
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 发送验证码
  const handleSendCode = async () => {
    console.log('handleSendCode 被调用', { phone: formData.phone, email: formData.email, mode, role });
    
    if (!formData.phone) {
      toast.error('请先输入手机号');
      return;
    }

    if (!formData.email) {
      toast.error('请先输入邮箱');
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('请输入正确的手机号');
      setFieldError('phone', '手机号格式错误');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('请输入正确的邮箱地址');
      setFieldError('email', '邮箱格式错误');
      return;
    }

    // 如果已经有倒计时在运行，先清理
    clearCountdownTimer();

    setSendingCode(true);
    try {
      console.log('发送验证码请求', {
        phone: formData.phone,
        email: formData.email,
        type: mode === 'register' ? 'register' : 'login',
        role,
      });
      
      await sendVerificationCode({
        phone: formData.phone,
        email: formData.email,
        type: mode === 'register' ? 'register' : 'login',
        role,
      });
      
      console.log('验证码发送成功');
      toast.success('验证码已发送到邮箱');
      
      // 开始倒计时
      setCodeCountdown(60);
      countdownTimerRef.current = setInterval(() => {
        setCodeCountdown((prev) => {
          if (prev <= 1) {
            clearCountdownTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('发送验证码失败', error);
      const errorMessage = error.message || '发送验证码失败';
      
      // 尝试解析字段级别的错误（如手机号或邮箱已被注册）
      const fieldError = parseFieldError(errorMessage);
      if (fieldError) {
        setFieldError(fieldError.field, fieldError.message);
        // 如果是已注册错误，不显示 toast，因为已经在输入框下方显示了
        if (!errorMessage.includes('已注册') && !errorMessage.includes('已存在')) {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
      
      // 发送失败时重置倒计时
      setCodeCountdown(0);
    } finally {
      setSendingCode(false);
    }
  };

  // 清除字段错误
  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // 设置字段错误
  const setFieldError = (fieldName: string, errorMessage: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  };

  // 解析后端错误信息，提取字段错误
  const parseFieldError = (errorMessage: string): { field: string; message: string } | null => {
    const lowerMessage = errorMessage.toLowerCase();
    
    // 手机号相关错误（包括已注册）
    if (errorMessage.includes('手机号') || 
        errorMessage.includes('手机') ||
        lowerMessage.includes('phone') ||
        errorMessage.includes('该手机号') ||
        errorMessage.includes('手机号已被注册') ||
        errorMessage.includes('手机号已存在') ||
        errorMessage.includes('手机号已注册')) {
      // 如果是已注册错误，使用更友好的提示
      if (errorMessage.includes('已注册') || errorMessage.includes('已存在') || errorMessage.includes('已被注册')) {
        return { field: 'phone', message: '该手机号已被注册' };
      }
      return { field: 'phone', message: errorMessage };
    }
    
    // 邮箱相关错误（包括已注册）
    if (errorMessage.includes('邮箱') || 
        errorMessage.includes('邮件') ||
        lowerMessage.includes('email') ||
        errorMessage.includes('该邮箱') ||
        errorMessage.includes('邮箱已被注册') ||
        errorMessage.includes('邮箱已存在') ||
        errorMessage.includes('邮箱已注册')) {
      // 如果是已注册错误，使用更友好的提示
      if (errorMessage.includes('已注册') || errorMessage.includes('已存在') || errorMessage.includes('已被注册')) {
        return { field: 'email', message: '该邮箱已被注册' };
      }
      return { field: 'email', message: errorMessage };
    }
    
    // 验证码相关错误
    if (errorMessage.includes('验证码') || 
        errorMessage.includes('验证') ||
        lowerMessage.includes('code') ||
        lowerMessage.includes('verification')) {
      return { field: 'code', message: errorMessage };
    }
    
    // 密码相关错误
    if (errorMessage.includes('密码') || 
        lowerMessage.includes('password')) {
      return { field: 'password', message: errorMessage };
    }
    
    return null;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 清除之前的错误
    setFieldErrors({});

    try {
      if (mode === 'login') {
        // 内部测试账号（前端直通最高权限）
        if (formData.phone === '1' && formData.password === '1') {
          const internalRole = role;
          toast.success('已使用内部测试账号直接登录当前角色（仅前端生效）');

          resetRoleState();
          setRole(internalRole);
          setUserProfile({
            id: 'internal-1',
            name: '内部测试账号',
            email: '',
            role: internalRole,
            avatar: '👨‍💻',
            phone: '1',
            company: 'AgriVerse',
            location: '内部测试环境',
          });
          setPermissions([...(rolePermissions[internalRole] ?? [])]);
          setToken('internal-dev-token');

          onLogin?.({
            role: internalRole,
            user: {
              id: 'internal-1',
              name: '内部测试账号',
              phone: '1',
              email: '',
              role: internalRole,
            },
          });

          const path =
            internalRole === 'farmer'
              ? '/farmer-app'
              : internalRole === 'buyer'
              ? '/buyer-app'
              : internalRole === 'bank'
              ? '/bank-app'
              : internalRole === 'expert'
              ? '/expert-app'
              : internalRole === 'admin'
              ? '/admin-app'
              : `/${internalRole}`;
          navigate(path);
          return;
        }

        // 正常登录（走后端）
        const loginData: LoginRequest = {
          phone: formData.phone,
          password: formData.password,
          role,
        };
        
        const response = await login(loginData);

        console.log('登录成功，响应:', response);

        toast.success(`欢迎进入${config.title}！`);

        // 将后端返回的 role 转换为小写（因为 rolePermissions 使用小写 key）
        const backendRole = response.user.role;
        const r = (typeof backendRole === 'string' ? backendRole.toLowerCase() : backendRole) as RoleType;
        
        console.log('后端返回的role:', backendRole, '转换后:', r);
        
        // 先计算导航路径
        const path =
          r === 'farmer'
            ? '/farmer-app'
            : r === 'buyer'
            ? '/buyer-app'
            : r === 'bank'
            ? '/bank-app'
            : r === 'expert'
            ? '/expert-app'
            : r === 'admin'
            ? '/admin-app'
            : `/${r}`;
        
        console.log('设置导航路径:', path);
        pendingNavigation.current = path;
        
        // 直接设置新状态（不清空旧状态，直接覆盖）
        console.log('设置角色:', r);
        setRole(r);
        setUserProfile({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email || '',
          role: r, // 使用转换后的小写 role
          avatar: response.user.avatar || '👤',
          phone: response.user.phone,
          company: response.user.company,
          location: response.user.location,
        });
        
        // 使用转换后的小写 role 获取权限
        const permissions = rolePermissions[r] ?? [];
        console.log('设置权限:', permissions, '权限数量:', permissions.length);
        setPermissions([...permissions]);
        
        console.log('设置token:', response.token);
        setToken(response.token);

        onLogin?.({
          role: response.user.role,
          user: response.user,
        });
      } else {
        // 注册
        if (!formData.code) {
          toast.error('请输入邮箱验证码');
          setLoading(false);
          return;
        }

        if (!formData.password || formData.password.length < 6) {
          toast.error('请设置至少6位的登录密码');
          setLoading(false);
          return;
        }

        const registerData: RegisterRequest = {
          phone: formData.phone,
          email: formData.email,
          code: formData.code,
          password: formData.password,
          role,
          inviteCode: formData.inviteCode || undefined,
        };

        await register(registerData);

        toast.success(`注册成功！请使用手机号和密码登录`);

        // 注册成功后，切换到登录模式
        // 保留手机号，清空密码和验证码，方便用户直接登录
        setFormData({
          phone: formData.phone, // 保留手机号
          email: formData.email, // 保留邮箱（虽然登录不需要，但保留也无妨）
          code: '', // 清空验证码
          password: '', // 清空密码，让用户重新输入
          inviteCode: '' // 清空邀请码
        });
        
        // 切换到登录模式
        setMode('login');
        
        // 清除所有错误
        setFieldErrors({});
        
        // 不清空角色状态，保持当前角色选择
        // 不设置token和用户信息，等待用户登录
      }
    } catch (error: any) {
      const errorMessage = error.message || '操作失败，请重试';
      
      // 尝试解析字段级别的错误
      const fieldError = parseFieldError(errorMessage);
      if (fieldError) {
        setFieldError(fieldError.field, fieldError.message);
      } else {
        // 如果不是字段错误，显示toast提示
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ background: config.background }}
    >
      {/* 背景特效 */}
      <StationBackground role={role} />

      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-8 left-8 px-4 py-2 rounded-lg glass-morphism border border-white/20 text-white/80 hover:text-white transition-colors"
      >
        ← 返回星球选择
      </motion.button>

      {/* 登录卡片 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-full max-w-md"
      >
        {/* 舱门装饰 */}
        <motion.div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-xl"
          style={{ background: `radial-gradient(circle, ${config.primaryColor}40, transparent)` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative glass-morphism rounded-2xl border border-white/20 p-8"
          style={{ borderColor: `${config.primaryColor}40` }}
        >
          {/* 头部 */}
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {config.icon}
            </motion.div>
            <h2 className="text-2xl mb-2" style={{ color: config.primaryColor }}>
              {config.title}
            </h2>
            <p className="text-white/60 text-sm">{config.subtitle}</p>
            <div className="mt-2 text-xs text-white/40">
              ✨ {config.feature}
            </div>
          </div>

          {/* 登录/注册切换 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setFieldErrors({}); // 切换模式时清除错误
                clearCountdownTimer(); // 清理倒计时
                setCodeCountdown(0); // 重置倒计时状态
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                mode === 'login'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              登录舱门
            </button>
            <button
              onClick={() => {
                setMode('register');
                setFieldErrors({}); // 切换模式时清除错误
                clearCountdownTimer(); // 清理倒计时
                setCodeCountdown(0); // 重置倒计时状态
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                mode === 'register'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              注册新账号
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 手机号 */}
            <div>
              <label className="text-sm text-white/80 mb-2 block">手机号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    // 清除该字段的错误
                    clearFieldError('phone');
                  }}
                  placeholder="请输入手机号"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                    fieldErrors.phone 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-white/10 focus:border-white/30'
                  }`}
                  required
                />
              </div>
              {fieldErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.phone}
                </motion.p>
              )}
            </div>

            {/* 邮箱（注册时必填） */}
            {mode === 'register' && (
              <div>
                <label className="text-sm text-white/80 mb-2 block">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearFieldError('email');
                    }}
                    placeholder="请输入邮箱地址"
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                      fieldErrors.email 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </motion.p>
                )}
              </div>
            )}

            {mode === 'login' ? (
              <>
                {/* 密码 */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        clearFieldError('password');
                      }}
                      placeholder="请输入密码"
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                        fieldErrors.password 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-white/10 focus:border-white/30'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* 邮箱验证码 */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">邮箱验证码</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => {
                          setFormData({ ...formData, code: e.target.value });
                          clearFieldError('code');
                        }}
                        placeholder="邮箱验证码"
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                          fieldErrors.code 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'border-white/10 focus:border-white/30'
                        }`}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('按钮被点击', { 
                          sendingCode, 
                          codeCountdown, 
                          phone: formData.phone, 
                          email: formData.email,
                          phoneError: fieldErrors.phone,
                          emailError: fieldErrors.email
                        });
                        handleSendCode();
                      }}
                      disabled={
                        sendingCode || 
                        codeCountdown > 0 || 
                        !formData.phone || 
                        !formData.email || 
                        !!fieldErrors.phone || 
                        !!fieldErrors.email
                      }
                      className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingCode ? (
                        <Loader2 className="w-4 h-4 animate-spin inline" />
                      ) : codeCountdown > 0 ? (
                        `${codeCountdown}秒`
                      ) : (
                        '获取邮箱验证码'
                      )}
                    </button>
                  </div>
                  {fieldErrors.code && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.code}
                    </motion.p>
                  )}
                </div>

                {/* 设置密码 */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">设置密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        clearFieldError('password');
                      }}
                      placeholder="请设置6-20位密码"
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                        fieldErrors.password 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-white/10 focus:border-white/30'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </div>

                {/* 邀请码（农户专属） */}
                {role === 'farmer' && (
                  <div>
                    <label className="text-sm text-white/80 mb-2 block flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      邀请码（可选）
                    </label>
                    <input
                      type="text"
                      value={formData.inviteCode}
                      onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                      placeholder="输入后稻田将生长一茬新稻"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                )}
              </>
            )}

            {/* 提交按钮 */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}CC)`
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>正在开启舱门...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{mode === 'login' ? '进入空间站' : '创建账号'}</span>
                </>
              )}
            </motion.button>

            {/* 快捷登录（买家专属） */}
            {role === 'buyer' && mode === 'login' && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/40 text-center mb-3">快捷登录</p>
                <div className="flex gap-3">
                  {['微信', '支付宝', 'Apple'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm transition-colors"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* 安全提示（银行/管理员） */}
          {(role === 'bank' || role === 'admin') && (
            <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-2 text-xs text-white/60">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">
                    {role === 'bank' ? '支持硬件U-Key登录' : '需要内网IP+TOTP双因子认证'}
                  </p>
                  <p className="text-white/40">
                    企业级安全保障
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 空间站背景特效组件
function StationBackground({ role }: { role: RoleType }) {
  const config = stationConfig[role] || stationConfig.farmer; // 默认使用 farmer 配置作为后备

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 粒子效果 */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: config.primaryColor,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* 扫描线（买家/管理员） */}
      {(role === 'buyer' || role === 'admin') && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${config.primaryColor}80, transparent)` }}
          animate={{
            top: ['0%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* 环形轨道（专家） */}
      {role === 'expert' && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 opacity-20"
          style={{ borderColor: config.primaryColor }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </div>
  );
}
