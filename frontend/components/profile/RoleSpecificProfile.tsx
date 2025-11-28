import { motion } from "motion/react";
import { 
  Sprout, ShoppingBag, Building2, GraduationCap, Shield,
  FileText, Package, TrendingUp, Calendar, Users, Settings,
  BarChart3, BookOpen, Briefcase, CreditCard
} from "lucide-react";
import { useRole, getRoleName, getRoleColor } from "../../contexts/RoleContext";

export function RoleSpecificProfile() {
  const { role, userData } = useRole();

  if (!role) return null;

  const roleConfig = {
    farmer: {
      icon: Sprout,
      title: "农户专区",
      color: "#18FF74",
      sections: [
        {
          title: "我的产品",
          icon: Package,
          items: [
            { label: "在售产品", value: "12", action: "manage" },
            { label: "待上架", value: "3", action: "publish" },
            { label: "销售额", value: "¥125,600", action: "view" },
          ]
        },
        {
          title: "贷款管理",
          icon: CreditCard,
          items: [
            { label: "已申请", value: "2", action: "view-loans" },
            { label: "审批中", value: "1", action: "track" },
            { label: "额度余额", value: "¥30万", action: "apply" },
          ]
        },
        {
          title: "专家咨询",
          icon: GraduationCap,
          items: [
            { label: "已咨询", value: "23", action: "history" },
            { label: "预约中", value: "2", action: "appointments" },
          ]
        }
      ]
    },
    buyer: {
      icon: ShoppingBag,
      title: "买家专区",
      color: "#00D6C2",
      sections: [
        {
          title: "我的订单",
          icon: FileText,
          items: [
            { label: "待付款", value: "2", action: "pay" },
            { label: "待收货", value: "5", action: "track" },
            { label: "已完成", value: "156", action: "history" },
          ]
        },
        {
          title: "采购需求",
          icon: TrendingUp,
          items: [
            { label: "发布需求", value: "8", action: "manage-demands" },
            { label: "收到报价", value: "34", action: "view-quotes" },
            { label: "成交订单", value: "18", action: "orders" },
          ]
        },
        {
          title: "收藏与足迹",
          icon: Package,
          items: [
            { label: "收藏商品", value: "45", action: "favorites" },
            { label: "浏览记录", value: "890", action: "history" },
          ]
        }
      ]
    },
    bank: {
      icon: Building2,
      title: "银行专区",
      color: "#FFB800",
      sections: [
        {
          title: "贷款审批",
          icon: FileText,
          items: [
            { label: "待审批", value: "15", action: "approve" },
            { label: "已批准", value: "234", action: "approved" },
            { label: "已拒绝", value: "12", action: "rejected" },
          ]
        },
        {
          title: "风控管理",
          icon: Shield,
          items: [
            { label: "风险评估", value: "高", action: "assess" },
            { label: "逾期率", value: "0.8%", action: "monitor" },
            { label: "资产质量", value: "AAA", action: "report" },
          ]
        },
        {
          title: "合同管理",
          icon: Briefcase,
          items: [
            { label: "待签约", value: "8", action: "sign" },
            { label: "执行中", value: "156", action: "track" },
            { label: "已完成", value: "1,234", action: "archive" },
          ]
        }
      ]
    },
    expert: {
      icon: GraduationCap,
      title: "专家专区",
      color: "#A78BFA",
      sections: [
        {
          title: "咨询管理",
          icon: Users,
          items: [
            { label: "待接单", value: "5", action: "accept" },
            { label: "进行中", value: "3", action: "ongoing" },
            { label: "已完成", value: "1,230", action: "history" },
          ]
        },
        {
          title: "日程管理",
          icon: Calendar,
          items: [
            { label: "今日预约", value: "4", action: "today" },
            { label: "本周预约", value: "18", action: "week" },
            { label: "可预约时段", value: "编辑", action: "manage-calendar" },
          ]
        },
        {
          title: "知识发布",
          icon: BookOpen,
          items: [
            { label: "发布文章", value: "89", action: "articles" },
            { label: "问答解答", value: "567", action: "qa" },
            { label: "阅读量", value: "12.5万", action: "analytics" },
          ]
        }
      ]
    },
    admin: {
      icon: Shield,
      title: "管理员专区",
      color: "#FF6B9D",
      sections: [
        {
          title: "用户管理",
          icon: Users,
          items: [
            { label: "总用户", value: "8,456", action: "users" },
            { label: "今日新增", value: "23", action: "new-users" },
            { label: "活跃用户", value: "2,345", action: "active" },
          ]
        },
        {
          title: "系统监控",
          icon: BarChart3,
          items: [
            { label: "交易总额", value: "¥1,234万", action: "transactions" },
            { label: "贷款总额", value: "¥5,678万", action: "loans" },
            { label: "系统健康", value: "正常", action: "health" },
          ]
        },
        {
          title: "审核管理",
          icon: FileText,
          items: [
            { label: "待审核", value: "45", action: "pending" },
            { label: "商品审核", value: "12", action: "products" },
            { label: "认证审核", value: "8", action: "certifications" },
          ]
        }
      ]
    }
  };

  const config = roleConfig[role];
  if (!config) return null;

  const Icon = config.icon;

  const handleAction = (action: string) => {
    // 触发对应的导航事件
    const eventMap: Record<string, string> = {
      'approve': 'navigate-to-loan-approve',
      'manage-calendar': 'navigate-to-calendar',
      'apply': 'navigate-to-loan-apply',
      'users': 'navigate-to-admin-users',
    };
    
    const event = eventMap[action];
    if (event) {
      window.dispatchEvent(new CustomEvent(event));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 角色标识 */}
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
              border: `2px solid ${config.color}60`,
              boxShadow: `0 0 20px ${config.color}30`
            }}
          >
            <Icon className="w-8 h-8" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">{config.title}</h3>
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: `${config.color}20`,
                  color: config.color,
                  border: `1px solid ${config.color}40`
                }}
              >
                {getRoleName(role)}
              </span>
              <span className="text-white/60 text-sm">
                {userData?.name || '用户'}
              </span>
            </div>
          </div>
        </div>

        {/* 功能模块 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.sections.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${config.color}20`,
                      border: `1px solid ${config.color}30`
                    }}
                  >
                    <SectionIcon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <h4 className="text-white">{section.title}</h4>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <motion.button
                      key={itemIdx}
                      onClick={() => handleAction(item.action)}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <span className="text-white/60 text-sm">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{item.value}</span>
                        <span 
                          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: config.color }}
                        >
                          →
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
