import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  navigate?: NavigateFunction;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback navigate={this.props.navigate} onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback component that uses React Router navigation instead of page reload
 */
const ErrorFallback = ({ 
  navigate, 
  onRetry 
}: { 
  navigate?: NavigateFunction; 
  onRetry: () => void;
}) => {
  const handleRefresh = () => {
    if (navigate) {
      // Try to navigate to current path to refresh via React Router
      const currentPath = window.location.pathname;
      navigate(currentPath, { replace: true });
    } else {
      // Fallback to home route - no hard reload
      navigate?.('/', { replace: true });
    }
  };

  const handleGoHome = () => {
    if (navigate) {
      navigate('/', { replace: true });
    } else {
      // Fallback navigation without hard reload
      try {
        navigate?.('/', { replace: true });
      } catch (error) {
        console.error('Navigation failed, no fallback available:', error);
        // If navigate is not available, we can't safely navigate
        // The component will remain in error state
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="neu-container p-8 max-w-md w-full text-center space-y-4">
        <div className="neu-surface w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">
          We're sorry, but something unexpected happened. You can try to refresh or go back to home.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="neu-button-enhanced inline-flex items-center gap-2 justify-center"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <button
            onClick={handleRefresh}
            className="neu-button inline-flex items-center gap-2 justify-center"
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>
          <button
            onClick={handleGoHome}
            className="neu-button-secondary inline-flex items-center gap-2 justify-center"
          >
            <Home size={16} />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;