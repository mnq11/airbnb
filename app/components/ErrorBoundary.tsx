"use client";

import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import EmptyState from "@/app/components/EmptyState";

/**
 * ErrorFallback Component
 * 
 * Displays a user-friendly error message when an error occurs within a component.
 * 
 * @component
 * @param {FallbackProps} props - Error properties from react-error-boundary
 * @returns {JSX.Element} Error display component
 */
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <EmptyState
      title="حصل خطاء"
      subtitle="يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقًا"
      showReset
    />
  );
};

/**
 * Interface for ErrorBoundary component props
 * 
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - Child components to render within the error boundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * ErrorBoundary Component
 * 
 * Wraps application components to catch and handle errors gracefully.
 * Prevents the entire application from crashing when an error occurs.
 * 
 * @component
 * @param {ErrorBoundaryProps} props - Component props
 * @returns {JSX.Element} Error boundary wrapper
 */
const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const logError = (error: Error, info: { componentStack: string }) => {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", info.componentStack);
    
    // Here you could implement error reporting to a service like Sentry
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary; 