/**
 * Three.js 单例导出
 * 确保整个应用只有一个 Three.js 实例
 */

import * as THREE from 'three';

// 导出单例（所有组件必须从这里导入）
export default THREE;
export * from 'three';
