import { get, post } from './client';

/**
 * 启动匹配请求
 */
export interface StartMatchRequest {
  farmerId?: string;  // 可选，后端会从token中获取
  applyAmount: number;
  cropType?: string;
  location?: string;
}

/**
 * 匹配候选
 */
export interface MatchCandidate {
  farmerId: string;
  name: string;
  cropType?: string;
  matchScore?: number;
  amountNeeded: number;
  location?: string;
}

/**
 * 拼单组详情
 */
export interface MatchDetail {
  matchId: string;
  groupId: string;  // 拼单组ID
  targetAmount: number;
  currentAmount: number;
  members: {
    farmerId: string;
    name: string;
    amount: number;
  }[];
  status: 'MATCHING' | 'MATCHED' | 'APPLIED' | 'FAILED';
}

/**
 * 创建拼单组请求
 */
export interface CreateMatchRequest {
  targetAmount: number;
  purpose?: string;
  note?: string;
  waitHours?: number;
}

/**
 * 加入拼单组请求
 */
export interface JoinMatchRequest {
  amount: number;
  purpose?: string;
}

/**
 * 启动匹配（创建拼单组）
 * 映射到后端: POST /api/farmer/finance/joint-loan/create
 */
export async function startMatch(data: StartMatchRequest) {
  return await post('/farmer/finance/joint-loan/create', {
    amount: data.applyAmount,
    purpose: data.cropType || ''
  });
}

/**
 * 获取匹配候选（可加入的拼单组列表）
 * 注意：后端需要新增此接口，当前使用获取拼单组列表接口
 * 映射到后端: GET /api/farmer/finance/joint-loan/candidates?amount={amount}
 */
export async function getMatchCandidates(amount: number) {
  // 暂时使用获取拼单组列表接口，后端需要新增候选查询接口
  return await get<MatchCandidate[]>(`/farmer/finance/joint-loan/candidates?amount=${amount}`);
}

/**
 * 获取匹配详情（拼单组详情）
 * 映射到后端: GET /api/farmer/finance/joint-loan/{groupId}
 */
export async function getMatchDetail(matchId: string) {
  return await get<MatchDetail>(`/farmer/finance/joint-loan/${matchId}`);
}

/**
 * 加入拼单组
 * 映射到后端: POST /api/farmer/finance/joint-loan/{groupId}/join
 */
export async function joinMatch(matchId: string, amount: number, purpose?: string) {
  return await post(`/farmer/finance/joint-loan/${matchId}/join`, { 
    amount,
    purpose: purpose || ''
  });
}

/**
 * 退出拼单组
 * 注意：后端需要新增此接口
 * 映射到后端: POST /api/farmer/finance/joint-loan/{groupId}/quit
 */
export async function quitMatch(matchId: string) {
  return await post(`/farmer/finance/joint-loan/${matchId}/quit`, {});
}

/**
 * 创建拼单组
 * 映射到后端: POST /api/farmer/finance/joint-loan/create
 */
export async function createMatch(payload: CreateMatchRequest) {
  return await post('/farmer/finance/joint-loan/create', {
    amount: payload.targetAmount,
    purpose: payload.note || ''
  });
}

/**
 * 获取匹配结果（拼单组状态）
 * 映射到后端: GET /api/farmer/finance/joint-loan/{groupId}
 */
export async function getMatchResult(matchId: string) {
  const detail = await getMatchDetail(matchId);
  return {
    matchId: detail.matchId,
    status: detail.status === 'MATCHED' ? 'success' : 
            detail.status === 'FAILED' ? 'failed' : 'matching',
    mergedAmount: detail.currentAmount
  };
}


