import { useState } from "react";
import { uploadFile, type UploadFileType, type UploadResult } from "../../utils/uploadService";
import { Button } from "../ui/button";

interface FileUploaderProps {
  label: string;
  accept: string;
  type: UploadFileType;
  onUploaded: (file: UploadResult) => void;
}

export function FileUploader({ label, accept, type, onUploaded }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadFile(file, type);
      setFileName(res.filename);
      onUploaded(res);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="text-sm text-white/70">{label}</div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={uploading}>
          <label className="cursor-pointer">
            {uploading ? "上传中..." : "选择文件"}
            <input type="file" accept={accept} className="hidden" onChange={handleChange} />
          </label>
        </Button>
        {fileName && <span className="text-xs text-white/60 truncate max-w-[180px]">{fileName}</span>}
      </div>
    </div>
  );
}


