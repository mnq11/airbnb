"use client";

import { useEffect } from "react";

import EmptyState from "@/app/components/EmptyState";

/**
 * Interface for ErrorState component props
 * 
 * @interface ErrorStateProps
 * @property {Error} error - The error object caught by Next.js error boundary
 */
interface ErrorStateProps {
  error: Error;
}

/**
 * ErrorState Component
 * 
 * A global error handler component used by Next.js error boundaries to display
 * a user-friendly error message when uncaught errors occur in the application.
 * 
 * This component:
 * - Logs the error to the console for debugging purposes
 * - Displays a localized (Arabic) error message to the user
 * - Provides a consistent error UI using the EmptyState component
 * - Works with Next.js App Router error boundary system
 * 
 * Error recovery is handled by suggesting the user refresh the page.
 * 
 * @component
 * @param {ErrorStateProps} props - Component props
 * @returns {JSX.Element} Rendered error message with refresh suggestion
 */
const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <EmptyState title="حصل خطاء" subtitle="يرجى تحديث الصفحة" />;
};

export default ErrorState;
