import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Eye, Mail, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  orderNo: string;
  date: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  buyerName: string;
  buyerTaxNo: string;
  sellerName: string;
  sellerTaxNo: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

interface InvoiceDownloadProps {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDownload({ invoiceId, isOpen, onClose }: InvoiceDownloadProps) {
  const [invoice] = useState<Invoice>({
    id: invoiceId,
    orderNo: 'AGV20241102001',
    date: '2024-11-02',
    amount: 1280.00,
    taxAmount: 166.40,
    totalAmount: 1446.40,
    buyerName: '北京绿农贸易有限公司',
    buyerTaxNo: '91110105MA01XXXXX',
    sellerName: '延安有机农场',
    sellerTaxNo: '91610600MA09XXXXX',
    items: [
      {
        name: '有机富硒苹果',
        quantity: 100,
        price: 12.8,
        total: 1280.00,
      },
    ],
  });

  const handleDownload = () => {
    toast.success('发票PDF下载中...');
    // Mock PDF download
    setTimeout(() => {
      toast.success('发票已保存到下载文件夹');
    }, 1000);
  };

  const handleSendEmail = () => {
    const email = prompt('请输入接收邮箱:');
    if (email) {
      toast.success(`发票已发送至 ${email}`);
    }
  };

  const handlePreview = () => {
    toast.success('正在打开预览...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0D] border border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00D6C2]" />
            电子发票
          </DialogTitle>
        </DialogHeader>

        {/* Invoice Preview */}
        <div className="bg-white p-8 rounded-lg">
          <div className="border-2 border-gray-300 p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">电子发票</h1>
              <p className="text-sm text-gray-600">Electronic Invoice</p>
            </div>

            {/* Invoice Number */}
            <div className="mb-6 pb-4 border-b-2 border-gray-300">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">发票代码: 1100224130</p>
                  <p className="text-sm text-gray-600">发票号码: {invoice.orderNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">开票日期: {invoice.date}</p>
                </div>
              </div>
            </div>

            {/* Buyer & Seller Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-bold mb-2">购买方</h3>
                <p className="text-sm mb-1">名称: {invoice.buyerName}</p>
                <p className="text-sm">纳税人识别号: {invoice.buyerTaxNo}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">销售方</h3>
                <p className="text-sm mb-1">名称: {invoice.sellerName}</p>
                <p className="text-sm">纳税人识别号: {invoice.sellerTaxNo}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">货物或应税劳务名称</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">数量</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">单价</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">金额</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">¥{item.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">¥{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="text-right mb-6">
              <p className="mb-1">价税合计: <span className="font-bold text-lg">¥{invoice.totalAmount.toFixed(2)}</span></p>
              <p className="text-sm text-gray-600">其中: 金额 ¥{invoice.amount.toFixed(2)}, 税额 ¥{invoice.taxAmount.toFixed(2)}</p>
            </div>

            {/* Verification */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-300">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">本发票已通过区块链存证验证</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handlePreview}
            className="flex-1 bg-white/5 text-white border border-white/10 hover:bg-white/10"
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2] border border-[#00D6C2]/30 hover:bg-[#00D6C2]/30"
          >
            <Download className="w-4 h-4 mr-2" />
            下载PDF
          </Button>
          <Button
            onClick={handleSendEmail}
            className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:opacity-90"
          >
            <Mail className="w-4 h-4 mr-2" />
            发送邮箱
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
