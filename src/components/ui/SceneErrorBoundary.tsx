import React, { Component, ErrorInfo } from 'react';
import { Button } from './button';
import { Zap, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  retryCount: number;
}

/**
 * ErrorBoundary component to catch errors in the 3D scene
 * and prevent them from crashing the entire application
 */
export default class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      errorMessage: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorMessage: error.message || 'An error occurred in the 3D scene'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console
    console.error("Error in 3D scene:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prev => ({ 
      hasError: false, 
      retryCount: prev.retryCount + 1 
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use the default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-white p-6">
          <h3 className="mb-4 text-xl font-bold">3D Visualization Error</h3>
          <p className="mb-4 text-center">
            We encountered an issue with the space scene. This might be due to WebGL context loss or graphics hardware limitations.
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Error: {this.state.errorMessage}
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={this.handleRetry}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw size={16} /> Retry Rendering
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap size={16} /> Reload Application
            </Button>
          </div>
          {this.state.retryCount > 2 && (
            <p className="mt-4 text-sm text-yellow-400">
              Multiple retries failed. Try reloading the page or using a different browser.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
