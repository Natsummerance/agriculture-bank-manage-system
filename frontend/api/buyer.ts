// 买家相关 API

import { get, post, put } from './client';

/**
 * 买家商品列表项
 */
export interface BuyerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  farmerId: string;
  farmerName: string;
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  createdAt?: string;
}

/**
 * 买家商品列表响应
 */
export interface BuyerProductListResponse {
  products: BuyerProduct[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 买家商品列表查询参数
 */
export interface BuyerProductListParams {
  search?: string;      // 搜索关键词（商品名称或产地）
  category?: string;     // 类别筛选
  page?: number;        // 页码（从1开始）
  pageSize?: number;   // 每页数量
}

/**
 * 买家商品详情
 */
export interface BuyerProductDetail {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 订单项
 */
export interface OrderItem {
  productId: string;
  quantity: number;
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  items: OrderItem[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
}

/**
 * 订单项响应
 */
export interface BuyerOrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  productImage?: string;
}

/**
 * 买家订单
 */
export interface BuyerOrder {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  refundStatus?: string;
  refundReason?: string;
  items: BuyerOrderItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 买家订单列表响应
 */
export interface BuyerOrderListResponse {
  orders: BuyerOrder[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 更新订单状态请求
 */
export interface UpdateOrderStatusRequest {
  status: string;
}

/**
 * 获取买家商品列表
 * @param params 查询参数
 * @returns 商品列表响应
 */
export async function getBuyerProducts(
  params?: BuyerProductListParams
): Promise<BuyerProductListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.category) {
    queryParams.append('category', params.category);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/buyer/products/list${queryString ? `?${queryString}` : ''}`;
  
  return get<BuyerProductListResponse>(endpoint);
}

/**
 * 获取买家商品详情
 * @param productId 商品ID
 * @returns 商品详情
 */
export async function getBuyerProductDetail(
  productId: string
): Promise<BuyerProductDetail> {
  return get<BuyerProductDetail>(`/buyer/products/${productId}`);
}

/**
 * 创建订单
 * @param request 创建订单请求
 * @returns 订单信息
 */
export async function createBuyerOrder(
  request: CreateOrderRequest
): Promise<BuyerOrder> {
  return post<BuyerOrder>('/buyer/orders', request);
}

/**
 * 获取买家订单列表
 * @param params 查询参数
 * @returns 订单列表响应
 */
export async function getBuyerOrders(
  params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<BuyerOrderListResponse> {
  const queryParams = new URLSearchParams();
  
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
  const endpoint = `/buyer/orders${queryString ? `?${queryString}` : ''}`;
  
  return get<BuyerOrderListResponse>(endpoint);
}

/**
 * 获取买家订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export async function getBuyerOrderDetail(
  orderId: string
): Promise<BuyerOrder> {
  return get<BuyerOrder>(`/buyer/orders/${orderId}`);
}

/**
 * 更新订单状态
 * @param orderId 订单ID
 * @param request 更新状态请求
 * @returns 操作结果
 */
export async function updateBuyerOrderStatus(
  orderId: string,
  request: UpdateOrderStatusRequest
): Promise<void> {
  return put<void>(`/buyer/orders/${orderId}/status`, request);
}

/**
 * 取消订单
 * @param orderId 订单ID
 * @returns 操作结果
 */
export async function cancelBuyerOrder(
  orderId: string
): Promise<void> {
  return post<void>(`/buyer/orders/${orderId}/cancel`);
}


