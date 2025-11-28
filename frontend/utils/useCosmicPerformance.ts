/**
 * 宇宙场景性能档位检测
 * 根据设备能力自动调整粒子数量、纹理尺寸、帧率目标
 */

import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface CosmicPerformanceConfig {
  tier: PerformanceTier;
  particleCount: number;
  textureSize: number;
  targetFPS: number;
  pixelRatio: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  asteroidCount: number;
  starCount: number;
}

export function useCosmicPerformance(): CosmicPerformanceConfig {
  const [config, setConfig] = useState<CosmicPerformanceConfig>({
    tier: 'medium',
    particleCount: 5000,
    textureSize: 2048,
    targetFPS: 60,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    enablePostProcessing: true,
    enableShadows: true,
    asteroidCount: 2000,
    starCount: 5000
  });

  useEffect(() => {
    const detectTier = (): PerformanceTier => {
      // 检测GPU信息
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) return 'low';

      // 检测硬件并发数（CPU核心）
      const cores = navigator.hardwareConcurrency || 2;
      
      // 检测内存（如果可用）
      const memory = (navigator as any).deviceMemory || 4;
      
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 分档逻辑
      if (isMobile) {
        return memory > 4 ? 'medium' : 'low';
      }
      
      if (cores >= 8 && memory >= 8) {
        return 'high';
      } else if (cores >= 4 && memory >= 4) {
        return 'medium';
      } else {
        return 'low';
      }
    };

    const initialTier = detectTier();
    
    // 根据档位设置配置
    const configs: Record<PerformanceTier, CosmicPerformanceConfig> = {
      high: {
        tier: 'high',
        particleCount: 8000,
        textureSize: 4096,
        targetFPS: 120,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        enablePostProcessing: true,
        enableShadows: true,
        asteroidCount: 3000,
        starCount: 15000
      },
      medium: {
        tier: 'medium',
        particleCount: 5000,
        textureSize: 2048,
        targetFPS: 60,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        enablePostProcessing: true,
        enableShadows: true,
        asteroidCount: 2000,
        starCount: 5000
      },
      low: {
        tier: 'low',
        particleCount: 2000,
        textureSize: 1024,
        targetFPS: 45,
        pixelRatio: 1,
        enablePostProcessing: false,
        enableShadows: false,
        asteroidCount: 1000,
        starCount: 2000
      }
    };

    setConfig(configs[initialTier]);
    
    // 仅在初始化时输出性能档位信息
    console.log(`[Cosmic Scene] Performance tier: ${initialTier.toUpperCase()}`);
  }, []);

  return config;
}
