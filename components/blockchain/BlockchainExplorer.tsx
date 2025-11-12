/**
 * 区块链存证浏览器 - G2
 * 合同/订单/还款哈希上链 + 链上浏览器
 * Polygon zkEVM 模拟
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Lock,
  CheckCircle,
  Clock,
  ExternalLink,
  Copy,
  Search,
  FileText,
  ShoppingCart,
  CreditCard,
  Link as LinkIcon,
  Zap,
  Hash,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

type RecordType = 'contract' | 'order' | 'repayment';
type RecordStatus = 'pending' | 'confirmed' | 'finalized';

interface BlockchainRecord {
  id: string;
  type: RecordType;
  title: string;
  hash: string;
  blockNumber: number;
  timestamp: Date;
  status: RecordStatus;
  gasUsed: string;
  from: string;
  to: string;
  metadata: Record<string, any>;
}

const mockRecords: BlockchainRecord[] = [
  {
    id: 'rec-001',
    type: 'contract',
    title: '农业生产贷款合同',
    hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockNumber: 18234567,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'finalized',
    gasUsed: '0.00',
    from: '0x1234...5678',
    to: '0xabcd...ef90',
    metadata: {
      amount: 350000,
      loanTerm: 12,
      interestRate: 4.5
    }
  },
  {
    id: 'rec-002',
    type: 'order',
    title: '有机大米订单',
    hash: '0x9abc123def456789abcdef0123456789abcdef0123456789abcdef0123456789',
    blockNumber: 18234589,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'confirmed',
    gasUsed: '0.00',
    from: '0x9876...4321',
    to: '0xfedc...0987',
    metadata: {
      productId: 'RICE-001',
      quantity: 5000,
      totalPrice: 125000
    }
  },
  {
    id: 'rec-003',
    type: 'repayment',
    title: '月度还款记录',
    hash: '0xdef789abc123def789abc123def789abc123def789abc123def789abc1234567',
    blockNumber: 18234601,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'pending',
    gasUsed: '0.00',
    from: '0x5555...6666',
    to: '0x7777...8888',
    metadata: {
      loanId: 'LOAN-12345',
      amount: 12500,
      period: 3
    }
  }
];

interface BlockchainExplorerProps {
  onClose?: () => void;
}

export function BlockchainExplorer({ onClose }: BlockchainExplorerProps) {
  const [records, setRecords] = useState<BlockchainRecord[]>(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<RecordType | 'all'>('all');
  const [isScanning, setIsScanning] = useState(false);

  // 模拟区块链扫描
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1000);
    }, 10000);

    return () => clearInterval(scanInterval);
  }, []);

  const getTypeIcon = (type: RecordType) => {
    switch (type) {
      case 'contract': return <FileText className="w-5 h-5" />;
      case 'order': return <ShoppingCart className="w-5 h-5" />;
      case 'repayment': return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: RecordType) => {
    switch (type) {
      case 'contract': return '#00D6C2';
      case 'order': return '#FFD700';
      case 'repayment': return '#18FF74';
    }
  };

  const getStatusBadge = (status: RecordStatus) => {
    const configs = {
      pending: {
        label: '待确认',
        color: '#FFD700',
        icon: <Clock className="w-3 h-3" />
      },
      confirmed: {
        label: '已确认',
        color: '#00D6C2',
        icon: <CheckCircle className="w-3 h-3" />
      },
      finalized: {
        label: '已最终化',
        color: '#18FF74',
        icon: <Lock className="w-3 h-3" />
      }
    };

    const config = configs[status];
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color
        }}
      >
        {config.icon}
        {config.label}
      </div>
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`已复制${label}`);
  };

  const openInExplorer = (hash: string) => {
    // 模拟打开 Polygon zkEVM 浏览器
    window.open(`https://zkevm.polygonscan.com/tx/${hash}`, '_blank');
    toast.success('已在新标签页打开区块浏览器');
  };

  const filteredRecords = records.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl h-[90vh] glass-morphism rounded-2xl border border-[#00D6C2]/30 flex flex-col overflow-hidden"
      >
        {/* 头部 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20">
                <Shield className="w-6 h-6 text-[#00D6C2]" />
              </div>
              <div>
                <h2 className="flex items-center gap-2">
                  区块链存证浏览器
                  {isScanning && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-sm text-[#18FF74] flex items-center gap-1"
                    >
                      <Zap className="w-4 h-4" />
                      扫描中
                    </motion.span>
                  )}
                </h2>
                <p className="text-sm text-white/60">
                  Polygon zkEVM · 零Gas费用 · 司法级存证
                </p>
              </div>
            </div>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* 搜索和筛选 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索哈希值或标题..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00D6C2]/50"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'contract', 'order', 'repayment'] as const).map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    filterType === type
                      ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {type === 'all' ? '全部' : type === 'contract' ? '合同' : type === 'order' ? '订单' : '还款'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex">
          {/* 记录列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredRecords.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-white/40"
                >
                  <AlertCircle className="w-16 h-16 mb-4" />
                  <p>暂无存证记录</p>
                </motion.div>
              ) : (
                filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedRecord?.id === record.id
                        ? 'bg-gradient-to-br from-white/15 to-white/5 border-2 border-[#00D6C2]'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* 类型图标 */}
                      <div
                        className="p-3 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: `${getTypeColor(record.type)}20`,
                          color: getTypeColor(record.type)
                        }}
                      >
                        {getTypeIcon(record.type)}
                      </div>

                      {/* 记录信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="flex-1">{record.title}</h4>
                          {getStatusBadge(record.status)}
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-white/60 font-mono">
                            <Hash className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{formatHash(record.hash)}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(record.hash, '交易哈希');
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Copy className="w-3 h-3" />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-4 text-white/40 text-xs">
                            <span>区块 #{record.blockNumber.toLocaleString()}</span>
                            <span>·</span>
                            <span>{new Date(record.timestamp).toLocaleString('zh-CN')}</span>
                            <span>·</span>
                            <span>Gas: {record.gasUsed} MATIC</span>
                          </div>
                        </div>
                      </div>

                      {/* 外部浏览器链接 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openInExplorer(record.hash);
                        }}
                        className="p-2 rounded-lg hover:bg-[#00D6C2]/20 text-[#00D6C2] flex-shrink-0"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* 详情面板 */}
          <AnimatePresence>
            {selectedRecord && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-96 border-l border-white/10 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white">存证详情</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRecord(null)}
                    className="p-1 rounded hover:bg-white/10 text-white/60"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* 状态卡片 */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">当前状态</span>
                      {getStatusBadge(selectedRecord.status)}
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: selectedRecord.status === 'finalized' ? '100%' :
                                 selectedRecord.status === 'confirmed' ? '66%' : '33%'
                        }}
                        className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                      />
                    </div>
                  </div>

                  {/* 交易信息 */}
                  <div className="space-y-3">
                    <h4 className="text-sm text-white/80">交易信息</h4>
                    
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-white/40 mb-1">交易哈希</div>
                      <div className="font-mono text-xs text-white/80 break-all">
                        {selectedRecord.hash}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="text-xs text-white/40 mb-1">区块高度</div>
                        <div className="font-mono text-sm text-white">
                          #{selectedRecord.blockNumber.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="text-xs text-white/40 mb-1">Gas费用</div>
                        <div className="font-mono text-sm text-[#18FF74]">
                          {selectedRecord.gasUsed} MATIC
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-white/40 mb-1">发送方</div>
                      <div className="font-mono text-xs text-white/80">
                        {selectedRecord.from}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-white/40 mb-1">接收方</div>
                      <div className="font-mono text-xs text-white/80">
                        {selectedRecord.to}
                      </div>
                    </div>
                  </div>

                  {/* 元数据 */}
                  <div className="space-y-3">
                    <h4 className="text-sm text-white/80">业务数据</h4>
                    <div className="p-3 rounded-lg bg-white/5 space-y-2">
                      {Object.entries(selectedRecord.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-white/60">{key}</span>
                          <span className="text-white font-mono">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openInExplorer(selectedRecord.hash)}
                      className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      在浏览器中查看
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => copyToClipboard(selectedRecord.hash, '交易哈希')}
                      className="w-full py-3 px-4 rounded-lg bg-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" />
                      复制哈希
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部状态栏 */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#18FF74] animate-pulse" />
              <span>Polygon zkEVM 已连接</span>
            </div>
            <span>·</span>
            <span>{filteredRecords.length} 条记录</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <LinkIcon className="w-4 h-4" />
            <span className="font-mono text-xs">零Gas · 即时确认</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
