import { useState } from "react";
import { motion } from "motion/react";
import { Download, FileText, Image, FileCheck, Package } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useBankApprovalStore } from "../../../stores/bankApprovalStore";

const mockDocuments = [
  { id: "1", name: "身份证正反面", type: "image", size: "2.5MB", uploadedAt: "2025-03-01" },
  { id: "2", name: "营业执照", type: "image", size: "1.8MB", uploadedAt: "2025-03-01" },
  { id: "3", name: "财务报表", type: "file", size: "3.2MB", uploadedAt: "2025-03-01" },
  { id: "4", name: "土地承包合同", type: "file", size: "5.1MB", uploadedAt: "2025-03-01" },
  { id: "5", name: "银行流水", type: "file", size: "4.6MB", uploadedAt: "2025-03-01" },
];

export default function BankApplicationDownload() {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id") || "fa_001";
  const { approvals } = useBankApprovalStore();
  const application = approvals.find((a) => a.id === applicationId);

  const handleDownloadAll = async () => {
    try {
      toast.success("正在打包下载所有资料...");
      // 模拟打包下载：创建一个包含所有文档信息的文本文件
      const content = mockDocuments.map((doc) => 
        `${doc.name} (${doc.type === 'image' ? '图片' : '文件'}) - ${doc.size} - ${doc.uploadedAt}`
      ).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `申请资料_${applicationId}_${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("资料包已下载");
    } catch (error: any) {
      toast.error("下载失败，请稍后重试");
    }
  };

  const handleDownloadSingle = (docId: string) => {
    const doc = mockDocuments.find((d) => d.id === docId);
    if (!doc) return;
    
    try {
      toast.success(`正在下载 ${doc.name}...`);
      // 模拟下载：创建一个占位文件
      const content = `这是 ${doc.name} 的占位文件。\n实际项目中，这里应该从服务器下载真实文件。\n\n文件信息：\n- 类型：${doc.type === 'image' ? '图片' : '文件'}\n- 大小：${doc.size}\n- 上传时间：${doc.uploadedAt}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name + '.txt';
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${doc.name} 已下载`);
    } catch (error: any) {
      toast.error("下载失败，请稍后重试");
    }
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              申请资料包下载
            </h2>
            <p className="text-sm text-white/60">
              下载融资申请的所有附件资料
            </p>
          </div>
          <Button
            onClick={handleDownloadAll}
            className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
          >
            <Package className="w-4 h-4 mr-2" />
            打包下载全部
          </Button>
        </motion.div>

        {/* 申请信息 */}
        {application && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-[#FFD700]" />
              <h3 className="text-lg">申请信息</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <div className="text-white/60 mb-1">申请编号</div>
                <div className="text-white">{application.id}</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">农户名称</div>
                <div className="text-white">{application.farmerName}</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">申请金额</div>
                <div className="text-[#FFD700] font-semibold">¥{application.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">申请期限</div>
                <div className="text-white">{application.term}</div>
              </div>
            </div>
          </motion.section>
        )}

        {/* 资料列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">申请资料 ({mockDocuments.length} 份)</h3>
          </div>

          <div className="space-y-3">
            {mockDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {doc.type === "image" ? (
                    <Image className="w-8 h-8 text-[#FFD700]" />
                  ) : (
                    <FileText className="w-8 h-8 text-[#FF8C00]" />
                  )}
                  <div>
                    <div className="font-semibold text-white">{doc.name}</div>
                    <div className="text-sm text-white/60">
                      {doc.size} · {doc.uploadedAt}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadSingle(doc.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

