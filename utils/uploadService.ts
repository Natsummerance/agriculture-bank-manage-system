import { API_BASE_URL } from "../api/client";

export type UploadFileType = "image" | "pdf" | "excel";

export interface UploadResult {
  url: string;
  filename: string;
  originalName?: string;
  contentType?: string;
  size: number;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function uploadFile(file: File, type: UploadFileType): Promise<UploadResult> {
  if (type !== "image") {
    return {
      url: URL.createObjectURL(file),
      filename: file.name,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
    };
  }

  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error("仅支持 JPG / PNG / GIF / WebP 格式的图片");
  }

  const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`图片大小不能超过 ${MAX_IMAGE_SIZE_MB}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("上传失败：无法解析服务器响应");
  }

  if (!response.ok || !data?.success) {
    const message = data?.message ?? response.statusText ?? "上传失败，请稍后重试";
    throw new Error(message);
  }

  return data.data as UploadResult;
}

