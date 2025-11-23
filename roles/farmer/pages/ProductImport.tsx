import { useState } from "react";
import { FileUploader } from "../../../components/common";
import { Button } from "../../../components/ui/button";
import { useFarmerProductStore } from "../../../stores/farmerProductStore";

interface ParsedRow {
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
}

export default function ProductImport() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const { addProduct } = useFarmerProductStore();

  const handleUploaded = async (file: { url: string; filename: string }) => {
    // 简单示意：真实解析应使用 SheetJS 等库，这里只做占位
    console.log("Uploaded excel mock file:", file);
    // Mock 一些行数据
    setRows([
      {
        name: "东北稻花香大米 5kg",
        category: "大米",
        price: 89.9,
        stock: 100,
        origin: "黑龙江五常",
      },
      {
        name: "赣南脐橙 10斤装",
        category: "水果",
        price: 79.9,
        stock: 80,
        origin: "江西赣州",
      },
    ]);
  };

  const handleImport = () => {
    rows.forEach((r) =>
      addProduct({
        name: r.name,
        category: r.category,
        price: r.price,
        stock: r.stock,
        origin: r.origin,
        description: "",
      }),
    );
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">批量导入库存</h1>
      <p className="text-sm text-white/60">
        通过上传 Excel（占位示意），解析出商品名称、类别、单价、库存与产地，校验通过后批量写入商品列表。
      </p>
      <FileUploader
        label="上传库存 Excel 文件（示意）"
        accept=".xlsx,.xls"
        type="excel"
        onUploaded={handleUploaded}
      />
      {rows.length > 0 && (
        <div className="space-y-2 text-sm">
          <div className="text-white/70 mt-4">解析预览：</div>
          {rows.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-white/60">
                  类别：{r.category} · 产地：{r.origin}
                </div>
              </div>
              <div className="text-xs text-white/60">
                价格：¥{r.price} · 库存：{r.stock}
              </div>
            </div>
          ))}
          <Button size="sm" onClick={handleImport}>
            批量导入到商品列表（本地模拟）
          </Button>
        </div>
      )}
    </div>
  );
}


