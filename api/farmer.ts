// 农户相关 API

import { get, post } from './client';

/**
 * 商品列表项
 */
export interface FarmerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  status: 'on' | 'off';
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 商品列表响应
 */
export interface ProductListResponse {
  products: FarmerProduct[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 商品列表查询参数
 */
export interface ProductListParams {
  search?: string;      // 搜索关键词（商品名称或产地）
  status?: string;      // 状态筛选：all-全部, on-已上架, off-已下架
  page?: number;        // 页码（从1开始）
  pageSize?: number;   // 每页数量
}

/**
 * 商品上下架请求
 */
export interface ToggleStatusRequest {
  productId: string;
  status: 'on' | 'off';
}

/**
 * 热门商品
 */
export interface TopProduct {
  id: string;
  name: string;
  viewCount: number;
  favoriteCount: number;
  shareCount: number;
}

/**
 * 趋势数据
 */
export interface TrendData {
  name: string;   // 日期名称，如"近5天前"、"今天"
  value: number; // 浏览量
}

/**
 * 商品数据看板响应
 */
export interface ProductDashboardResponse {
  totalView: number;        // 总浏览量
  totalFavorite: number;    // 总收藏数
  totalShare: number;       // 总分享数
  avgView: number;         // 平均浏览量
  topProducts: TopProduct[]; // 热门商品TOP5
  trendData: TrendData[];   // 近7日浏览趋势数据
}

/**
 * 获取农户商品列表
 * @param params 查询参数
 * @returns 商品列表响应
 */
export async function getFarmerProducts(
  params?: ProductListParams
): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/farmer/products/list${queryString ? `?${queryString}` : ''}`;
  
  return get<ProductListResponse>(endpoint);
}

/**
 * 商品上下架
 * @param request 上下架请求
 * @returns 操作结果
 */
export async function toggleProductStatus(
  request: ToggleStatusRequest
): Promise<void> {
  return post<void>('/farmer/products/toggle-status', request);
}

/**
 * 获取商品数据看板
 * @returns 数据看板响应
 */
export async function getProductDashboard(): Promise<ProductDashboardResponse> {
  return get<ProductDashboardResponse>('/farmer/products/dashboard');
}

/**
 * 农户融资申请（占位）
 */
export async function submitFarmerFinanceApp() {
  // TODO: 调用后端农户融资申请接口
  return { success: true };
}


