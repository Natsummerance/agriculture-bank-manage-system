export interface MatchFarmerProfile {
  farmerId: string;
  name: string;
  cropType: string;
  creditLevel: number; // 1-5
  location: string; // 简化为 "省市县" 字符串
  amountNeeded: number;
}

// 简化版“距离”算法：同县记为 0，不同县视为 50km，用来演示评分逻辑
function distanceScore(aLoc: string, bLoc: string): number {
  if (!aLoc || !bLoc) return 50;
  const aParts = aLoc.split(/[-/]/);
  const bParts = bLoc.split(/[-/]/);
  return aParts[aParts.length - 1] === bParts[bParts.length - 1] ? 0 : 50;
}

export function calcMatchScore(a: MatchFarmerProfile, b: MatchFarmerProfile): number {
  let score = 0;

  // 距离越近越高
  const dist = distanceScore(a.location, b.location);
  score += Math.max(0, 100 - dist);

  // 作物类型相同加 20 分
  if (a.cropType === b.cropType) {
    score += 20;
  }

  // 信用等级平均 * 10
  const avgCredit = (a.creditLevel + b.creditLevel) / 2;
  score += avgCredit * 10;

  return Math.min(score, 100);
}


