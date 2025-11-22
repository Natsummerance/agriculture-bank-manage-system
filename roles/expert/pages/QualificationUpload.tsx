import { useState } from "react";
import { motion } from "motion/react";
import { Upload, FileText, CheckCircle2, XCircle, Shield, Award, GraduationCap } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const qualificationSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  idCard: z.string().regex(/^\d{17}[\dXx]$/, "请输入正确的身份证号"),
  field: z.string().min(1, "请输入专业领域"),
  experience: z.string().min(1, "请输入从业经验"),
  education: z.string().min(1, "请输入学历"),
  certificate: z.string().optional(),
});

interface QualificationFile {
  id: string;
  name: string;
  type: "idCard" | "certificate" | "diploma" | "other";
  url: string;
  uploadedAt: string;
}

const mockFiles: QualificationFile[] = [
  {
    id: "1",
    name: "身份证正面.jpg",
    type: "idCard",
    url: "",
    uploadedAt: "2025-03-01",
  },
];

export default function ExpertQualificationUpload() {
  const [files, setFiles] = useState<QualificationFile[]>(mockFiles);
  const [certificationStatus, setCertificationStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const form = useZodForm(qualificationSchema, {
    defaultValues: {
      name: "",
      idCard: "",
      field: "",
      experience: "",
      education: "",
      certificate: "",
    },
  });

  const handleFileUpload = (type: QualificationFile["type"]) => {
    toast.success(`上传${type === "idCard" ? "身份证" : type === "certificate" ? "证书" : "学历证明"}`);
    // TODO: 实现文件上传逻辑
  };

  const handleSubmit = form.handleSubmit((values) => {
    toast.success("资质信息已提交，等待审核");
    setCertificationStatus("pending");
  });

  const fileTypeConfig = {
    idCard: { label: "身份证", icon: Shield, color: "text-blue-400" },
    certificate: { label: "专业证书", icon: Award, color: "text-amber-400" },
    diploma: { label: "学历证明", icon: GraduationCap, color: "text-emerald-400" },
    other: { label: "其他资料", icon: FileText, color: "text-white/60" },
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              资质上传与认证
            </h2>
            <p className="text-sm text-white/60">
              上传专业资质证明，完成专家认证
            </p>
          </div>
          {certificationStatus === "approved" && (
            <div className="text-sm px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              已认证
            </div>
          )}
          {certificationStatus === "pending" && (
            <div className="text-sm px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              审核中
            </div>
          )}
        </motion.div>

        {/* 基本信息表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg">基本信息</h3>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>身份证号</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>专业领域</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10" placeholder="如：水稻种植、果树管理" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学历</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10" placeholder="如：本科、硕士、博士" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>从业经验</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" placeholder="如：10年水稻种植经验" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
              >
                提交认证申请
              </Button>
            </form>
          </Form>
        </motion.section>

        {/* 文件上传 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">资质文件</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(["idCard", "certificate", "diploma", "other"] as const).map((type) => {
              const config = fileTypeConfig[type];
              const Icon = config.icon;
              const uploadedFile = files.find((f) => f.type === type);

              return (
                <motion.div
                  key={type}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <div className="font-semibold text-white">{config.label}</div>
                      {uploadedFile && (
                        <div className="text-xs text-white/60">{uploadedFile.name}</div>
                      )}
                    </div>
                  </div>
                  {uploadedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        已上传
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleFileUpload(type)}>
                        重新上传
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleFileUpload(type)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      上传文件
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

