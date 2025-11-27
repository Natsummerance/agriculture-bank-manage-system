import { useState } from "react";
import { motion } from "motion/react";
import { Printer, CheckSquare, Download } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function FarmerOrderPrintLabels() {
  const { orders } = useFarmerOrderStore();
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const shippedOrders = orders.filter((o) => o.status === "shipped" && o.trackingNumber);

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handlePrint = () => {
    if (selectedOrders.size === 0) {
      toast.error("请至少选择一个订单");
      return;
    }
    
    try {
      const selectedOrdersList = shippedOrders.filter((o) => selectedOrders.has(o.id));
      const printContent = selectedOrdersList.map((order) => `
        ====================================
        电子面单
        ====================================
        订单号：${order.id}
        买家：${order.buyerName}
        快递公司：${order.logisticsCompany}
        运单号：${order.trackingNumber}
        金额：¥${order.totalAmount.toLocaleString()}
        打印时间：${new Date().toLocaleString()}
        ====================================
      `).join('\n\n');
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>电子面单打印</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${printContent}</pre>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
        toast.success(`正在打印 ${selectedOrders.size} 个订单的电子面单...`);
      } else {
        toast.error("无法打开打印窗口，请检查浏览器弹窗设置");
      }
    } catch (error: any) {
      toast.error("打印失败，请稍后重试");
    }
  };

  const handleBatchDownload = () => {
    if (selectedOrders.size === 0) {
      toast.error("请至少选择一个订单");
      return;
    }
    
    try {
      const selectedOrdersList = shippedOrders.filter((o) => selectedOrders.has(o.id));
      const content = selectedOrdersList.map((order) => `
====================================
电子面单
====================================
订单号：${order.id}
买家：${order.buyerName}
快递公司：${order.logisticsCompany}
运单号：${order.trackingNumber}
金额：¥${order.totalAmount.toLocaleString()}
生成时间：${new Date().toLocaleString()}
====================================
      `).join('\n\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `电子面单_${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`已下载 ${selectedOrders.size} 个订单的电子面单`);
    } catch (error: any) {
      toast.error("下载失败，请稍后重试");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              批量打印电子面单
            </h2>
            <p className="text-sm text-white/60">
              选择已发货订单，批量生成和打印电子面单
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("trade", "orders")}
            >
              返回订单列表
            </Button>
            {selectedOrders.size > 0 && (
              <>
                <Button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  打印 ({selectedOrders.size})
                </Button>
                <Button
                  onClick={handleBatchDownload}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载PDF
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* 订单列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">已发货订单</h3>
            </div>
            <div className="text-sm text-white/60">
              已选择 {selectedOrders.size} / {shippedOrders.length} 个订单
            </div>
          </div>

          {shippedOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Printer className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无已发货订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shippedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl glass-morphism border p-6 ${
                    selectedOrders.has(order.id)
                      ? "border-[#00D6C2] bg-[#00D6C2]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                        selectedOrders.has(order.id)
                          ? "border-[#00D6C2] bg-[#00D6C2]"
                          : "border-white/30"
                      }`}
                    >
                      {selectedOrders.has(order.id) && (
                        <CheckSquare className="w-4 h-4 text-black" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">订单 {order.id}</div>
                        <div className="text-[#18FF74] font-semibold">
                          ¥{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <div>买家：{order.buyerName}</div>
                        <div>快递公司：{order.logisticsCompany}</div>
                        <div>运单号：{order.trackingNumber}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.info(`打印订单 ${order.id} 的电子面单`);
                      }}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
