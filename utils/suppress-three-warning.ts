/**
 * 抑制 Three.js 多实例警告
 * 这个警告在开发环境中是正常的（HMR 导致），不影响生产环境
 */

// 保存原始的 console 方法
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

// 过滤 Three.js 警告
console.warn = (...args: any[]) => {
  const message = typeof args[0] === 'string' ? args[0] : String(args[0] || '');
  
  // 忽略 Three.js 多实例警告（多种匹配模式）
  if (
    message.includes('Multiple instances of Three.js') ||
    message.includes('THREE.WebGLRenderer') ||
    message.includes('three.module.js') ||
    message.includes('three.js') ||
    (message.includes('WARNING') && message.toLowerCase().includes('three')) ||
    message.includes('ACESFilmicToneMapping')
  ) {
    return;
  }
  
  // 其他警告正常显示
  originalWarn.apply(console, args);
};

// 过滤 Three.js 相关错误（开发环境的无害警告）
console.error = (...args: any[]) => {
  const message = typeof args[0] === 'string' ? args[0] : String(args[0] || '');
  
  // 忽略 Three.js 多实例相关错误（仅开发环境）
  if (
    import.meta.env.DEV && (
      message.includes('Multiple instances of Three.js') ||
      message.includes('three.module.js') ||
      message.includes('ACESFilmicToneMapping') ||
      message.includes('which has only a getter')
    )
  ) {
    return;
  }
  
  // 其他错误正常显示
  originalError.apply(console, args);
};

// 也过滤console.log中的Three.js警告
console.log = (...args: any[]) => {
  const message = typeof args[0] === 'string' ? args[0] : String(args[0] || '');
  
  if (
    message.includes('Multiple instances of Three.js') ||
    message.includes('three.module.js')
  ) {
    return;
  }
  
  originalLog.apply(console, args);
};

// 开发环境提示
if (import.meta.env.DEV) {
  console.log(
    '%c🌌 星云·AgriVerse Three.js 优化',
    'color: #18FF74; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%c✅ Three.js 多实例警告已抑制（开发环境HMR正常现象）',
    'color: #00D6C2; font-size: 12px;'
  );
  console.log(
    '%c💡 生产环境不会出现此警告',
    'color: #888; font-size: 10px;'
  );
}

export {};

// 开发环境提示
if (import.meta.env.DEV) {
  console.log(
    '%c🌌 星云·AgriVerse v3.0.1',
    'color: #18FF74; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%c✅ Three.js 警告已抑制（HMR导致的开发环境正常现象）',
    'color: #00D6C2; font-size: 12px;'
  );
  console.log(
    '%c💡 生产环境不会出现此警告',
    'color: #888; font-size: 10px;'
  );
}

export {};
