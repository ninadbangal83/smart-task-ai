"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 mb-6">
                <AlertOctagon size={48} className="animate-bounce" />
              </div>

              <h1 className="text-2xl font-bold text-slate-50 mb-3">Something went wrong</h1>
              <p className="text-slate-400 text-sm mb-6">
                A critical client-side rendering error occurred. The application was saved from crashing by the Error Boundary.
              </p>

              <div className="w-full bg-slate-950 rounded-xl p-4 text-left border border-slate-800 text-xs text-red-400 font-mono mb-8 max-h-40 overflow-y-auto">
                <span className="font-bold block text-red-500 mb-1">Error Details:</span>
                {this.state.error?.message || 'Unknown render exception'}
              </div>

              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-95"
              >
                <RotateCcw size={16} />
                Reset & Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
