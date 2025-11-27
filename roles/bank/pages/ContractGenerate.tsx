import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, CheckCircle2, Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useFinancingStore } from "../../../stores/financingStore";

const mockContract = {
  id: "CT20250301001",
  farmerName: "张三",
  farmerIdCard: "320***********1234",
  amount: 200000,
  term: 12,
  rate: 5.5,
  purpose: "扩大水稻种植面积，购买农机设备",
  startDate: "2025-03-01",
  endDate: "2026-03-01",
  repaymentMethod: "等额本息",
  bankName: "中国农业银行",
  bankAccount: "6228***********5678",
  clauses: [
    "1. 借款人应按照合同约定按时足额还款。",
    "2. 借款人不得将贷款用于合同约定以外的用途。",
    "3. 借款人应提供真实、完整的资料。",
    "4. 如发生逾期，将按日收取罚息。",
  ],
};

export default function BankContractGenerate() {
  const [searchParams] = useSearchParams();
  const financingId = searchParams.get("id") || "fa_001";
  const { list } = useFinancingStore();
  const financing = list.find((f) => f.id === financingId);

  const handleGenerate = () => {
    toast.success("合同已生成");
  };

  const handleDownload = () => {
    try {
      // 生成合同内容（HTML格式，可以转换为PDF）
      const contractHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>融资合同 - ${mockContract.id}</title>
          <style>
            body { font-family: SimSun, serif; padding: 40px; line-height: 1.8; }
            h1 { text-align: center; }
            .info { margin: 20px 0; }
            .signature { margin-top: 60px; }
          </style>
        </head>
        <body>
          <h1>融资合同</h1>
          <div class="info">
            <p><strong>合同编号：</strong>${mockContract.id}</p>
            <p><strong>借款人：</strong>${mockContract.farmerName}</p>
            <p><strong>贷款金额：</strong>¥${mockContract.amount.toLocaleString()}</p>
            <p><strong>贷款期限：</strong>${mockContract.term}个月</p>
            <p><strong>年利率：</strong>${mockContract.rate}%</p>
            <p><strong>资金用途：</strong>${mockContract.purpose}</p>
          </div>
          <div class="signature">
            <p>借款人签字：_________________</p>
            <p>银行签字：_________________</p>
            <p>日期：${new Date().toLocaleDateString()}</p>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([contractHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `合同_${mockContract.id}.html`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("合同已下载");
    } catch (error: any) {
      toast.error("下载失败，请稍后重试");
    }
  };

  const handlePreview = () => {
    // 打开新窗口预览合同
    const contractHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>合同预览 - ${mockContract.id}</title>
        <style>
          body { font-family: SimSun, serif; padding: 40px; line-height: 1.8; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; }
          .info { margin: 20px 0; }
          .clauses { margin: 20px 0; }
          .signature { margin-top: 60px; }
        </style>
      </head>
      <body>
        <h1>融资合同</h1>
        <div class="info">
          <p><strong>合同编号：</strong>${mockContract.id}</p>
          <p><strong>借款人：</strong>${mockContract.farmerName}</p>
          <p><strong>身份证号：</strong>${mockContract.farmerIdCard}</p>
          <p><strong>贷款金额：</strong>¥${mockContract.amount.toLocaleString()}</p>
          <p><strong>贷款期限：</strong>${mockContract.term}个月</p>
          <p><strong>年利率：</strong>${mockContract.rate}%</p>
          <p><strong>还款方式：</strong>${mockContract.repaymentMethod}</p>
          <p><strong>资金用途：</strong>${mockContract.purpose}</p>
          <p><strong>起始日期：</strong>${mockContract.startDate}</p>
          <p><strong>到期日期：</strong>${mockContract.endDate}</p>
        </div>
        <div class="clauses">
          <h2>合同条款</h2>
          ${mockContract.clauses.map((clause) => `<p>${clause}</p>`).join('')}
        </div>
        <div class="signature">
          <p>借款人签字：_________________</p>
          <p>银行签字：_________________</p>
          <p>日期：${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;
    
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(contractHTML);
      previewWindow.document.close();
      toast.success("合同预览已打开");
    } else {
      toast.error("无法打开预览窗口，请检查浏览器弹窗设置");
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
              合同生成
            </h2>
            <p className="text-sm text-white/60">
              为已审批通过的融资申请生成电子合同
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              预览合同
            </Button>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
            >
              <FileText className="w-4 h-4 mr-2" />
              生成合同
            </Button>
          </div>
        </motion.div>

        {/* 合同信息 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-lg">合同信息</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs text-white/60 mb-1">合同编号</div>
              <div className="text-white font-mono">{mockContract.id}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">融资申请ID</div>
              <div className="text-white">{financingId}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">借款人</div>
              <div className="text-white">{mockContract.farmerName}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">身份证号</div>
              <div className="text-white">{mockContract.farmerIdCard}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">贷款金额</div>
              <div className="text-2xl font-semibold text-[#FFD700]">
                ¥{mockContract.amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">贷款期限</div>
              <div className="text-white">{mockContract.term} 个月</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">年利率</div>
              <div className="text-white">{mockContract.rate}%</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">还款方式</div>
              <div className="text-white">{mockContract.repaymentMethod}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-white/60 mb-1">资金用途</div>
              <div className="text-white">{mockContract.purpose}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">起始日期</div>
              <div className="text-white">{mockContract.startDate}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">到期日期</div>
              <div className="text-white">{mockContract.endDate}</div>
            </div>
          </div>
        </motion.section>

        {/* 合同条款 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">合同条款</h3>
          </div>
          <div className="space-y-2">
            {mockContract.clauses.map((clause, index) => (
              <div key={index} className="text-sm text-white/80">
                {clause}
              </div>
            ))}
          </div>
        </motion.section>

        {/* 操作按钮 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            下载合同PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            发送给农户
          </Button>
        </motion.section>
      </div>
    </div>
  );
}

