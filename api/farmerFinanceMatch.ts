import { get, post } from './client';

export interface StartMatchRequest {
  farmerId: string;
  applyAmount: number;
  cropType: string;
  location: string;
}

export interface MatchCandidate {
  farmerId: string;
  name: string;
  cropType: string;
  matchScore: number;
  amountNeeded: number;
  location: string;
}

export interface MatchDetail {
  matchId: string;
  targetAmount: number;
  currentAmount: number;
  members: {
    farmerId: string;
    name: string;
    amount: number;
  }[];
  status: 'matching' | 'success' | 'failed';
}

export async function startMatch(data: StartMatchRequest) {
  // 占位实现：调用后端前可以返回本地 Mock
  return await post('/api/farmer/match/start', data);
}

export async function getMatchCandidates(amount: number) {
  return await get<MatchCandidate[]>(`/api/farmer/match/candidates?amount=${amount}`);
}

export async function getMatchDetail(matchId: string) {
  return await get<MatchDetail>(`/api/farmer/match/detail/${matchId}`);
}

export async function joinMatch(matchId: string, amount: number) {
  return await post('/api/farmer/match/join', { matchId, amount });
}

export async function quitMatch(matchId: string) {
  return await post('/api/farmer/match/quit', { matchId });
}

export async function createMatch(payload: { targetAmount: number; note?: string; waitHours: number }) {
  return await post('/api/farmer/match/create', payload);
}

export async function getMatchResult(matchId: string) {
  return await get<{ matchId: string; status: 'success' | 'failed'; mergedAmount: number }>(
    `/api/farmer/match/result/${matchId}`,
  );
}


