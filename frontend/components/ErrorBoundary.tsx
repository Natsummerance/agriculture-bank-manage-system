import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 * 捕获React组件树中的错误
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 过滤Figma相关错误
    const errorStr = String(error);
    if (
      errorStr.includes('figma.com') ||
      errorStr.includes('devtools_worker')
    ) {
      // 重置状态，忽略Figma错误
      this.setState({ hasError: false, error: null });
      return;
    }

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0A0D] to-[#121726] flex items-center justify-center p-6">
          <div className="glass-morphism rounded-2xl p-8 max-w-2xl w-full border border-red-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">出错了</h2>
                <p className="text-white/60 text-sm">应用遇到了一个错误</p>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <code className="text-red-400 text-sm font-mono">
                {this.state.error.message}
              </code>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white font-medium hover:opacity-90 transition-opacity"
            >
              重新加载页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
