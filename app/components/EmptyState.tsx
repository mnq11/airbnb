"use client";

import { useRouter } from "next/navigation";

import Button from "./Button";
import Heading from "./Heading";
import React from "react";

/**
 * Interface for EmptyState component props
 * 
 * @interface EmptyStateProps
 * @property {string} [title] - Main message to display in the empty state
 * @property {string} [subtitle] - Secondary message providing additional guidance
 * @property {boolean} [showReset] - Whether to show a reset button to clear filters
 */
interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

/**
 * EmptyState Component
 * 
 * A reusable component for displaying empty states across the application.
 * Used when no data is available to display, such as:
 * - No search results
 * - No favorites
 * - No bookings/listings
 * - Error states
 * 
 * The component includes a title, subtitle, and optional reset button
 * that redirects users to the homepage to start a new search.
 * 
 * @component
 * @param {EmptyStateProps} props - Component props
 * @returns {JSX.Element} Rendered empty state with optional reset button
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = "لا يوجد تطابق تام",
  subtitle = "حاول تغيير أو إزالة بعض المرشحات الخاصة بك",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      "
    >
      {/* Display the main heading with title and subtitle */}
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {/* Conditionally render reset button if showReset is true */}
        {showReset && (
          <Button
            outline
            label="إزالة جميع المرشحات"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
