'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary] Caught:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[60] px-3 sm:px-4 w-full">
            <div className="mx-auto max-w-xl rounded-t-2xl bg-[#0a0e1a]/80 backdrop-blur-[32px] border-t border-l border-r border-red-400/20 px-4 py-3 text-center">
              <p className="text-sm text-gray-300">Player encountered an error</p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
