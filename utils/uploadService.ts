export type UploadFileType = 'image' | 'pdf' | 'excel';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadFile(file: File, type: UploadFileType): Promise<UploadResult> {
  // 这里只做前端占位与简单校验，后续可替换为真实上传接口
  const maxSizeMB = type === 'video' ? 50 : 10;
  const maxSize = maxSizeMB * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(`文件大小不能超过 ${maxSizeMB}MB`);
  }

  // 模拟上传成功
  return {
    url: URL.createObjectURL(file),
    filename: file.name,
    size: file.size,
  };
}


