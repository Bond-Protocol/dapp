import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState((state) => {
      return { ...state, error, errorInfo };
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-[100vh] w-full flex-col items-center bg-black p-8 text-center">
          <div className="m-auto flex w-[50%] flex-col place-items-center justify-center border-4 border-light-primary p-8">
            <p className="text-light-alert">
              {this.state.error?.name}: {this.state.error?.message}
            </p>
            <div className="text-light-alert">{this.state.error?.message}</div>

            <div className="mt-4 text-left text-xs">
              {this.state.errorInfo?.componentStack}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
