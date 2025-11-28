/**
 * 应用启动初始化
 * 显示欢迎消息和系统信息
 */

export async function initializeApp(): Promise<void> {
  // 等待DOM完全加载
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  // 控制台欢迎信息
  setTimeout(() => {
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #00D6C2;'
    );
    console.log(
      '%c🌌 星云·AgriVerse',
      'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00D6C2, #18FF74); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
    );
    console.log(
      '%c农产品融销一体平台 v2.0',
      'font-size: 14px; color: #00D6C2;'
    );
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #00D6C2;'
    );
    console.log('%c系统状态:', 'color: #18FF74; font-weight: bold;');
    console.log('%c  ✓ WebGL 3D引擎', 'color: #00D6C2;');
    console.log('%c  ✓ 量子匹配系统', 'color: #00D6C2;');
    console.log('%c  ✓ 粒子动画引擎', 'color: #00D6C2;');
    console.log('%c  ✓ 五角色业务闭环', 'color: #00D6C2;');
    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #00D6C2;'
    );
  }, 500);

  // 设置全局变量
  (window as any).__agriverseVersion = '2.0.0';
  (window as any).__agriverseReady = true;

  return Promise.resolve();
}
