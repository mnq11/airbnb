import { SafeUser } from "@/app/types";
import React from "react";
import { BsEye } from "react-icons/bs";

/**
 * Interface for ViewCounter component props
 *
 * @interface ViewCounterProps
 * @property {string} listingId - Unique identifier for the property listing
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 * @property {number} [viewCounter] - Number of views the listing has received
 */
interface ViewCounterProps {
  listingId: string;
  currentUser?: SafeUser | null;
  viewCounter?: number;
}

/**
 * ViewCounter Component
 *
 * A component that displays the number of views a property listing has received.
 * Features a visual indicator with an eye icon and formatted view count.
 *
 * The component:
 * - Displays the view count with Arabic numeral formatting
 * - Shows a red eye icon for listings with views and a gray icon for zero views
 * - Has a semi-transparent background for better visibility on various backgrounds
 * - Prevents text selection and pointer events for better UX
 *
 * Used in listing cards and detail pages to indicate listing popularity.
 *
 * @component
 * @param {ViewCounterProps} props - Component props
 * @returns {JSX.Element} Rendered view counter with formatted count and icon
 */
const ViewCounter: React.FC<ViewCounterProps> = ({ viewCounter }) => {
  return (
    <div className="relative hover:opacity-80 transition z-10">
      {/* Counter container with semi-transparent background */}
      <div className="flex items-center justify-center bg-white bg-opacity-50 text-gray-900 rounded-md py-0.5 px-1">
        {/* View count with Arabic numeral formatting */}
        <div className="font-extrabold text-red-700 select-none pointer-events-none">
          {` ${(viewCounter || 0).toLocaleString("ar-EG")} `}
        </div>
        {/* Eye icon with conditional color based on view count */}
        <div className="flex items-center">
          <BsEye
            className={
              viewCounter ? "text-red-700 ml-1" : "text-neutral-500/70 ml-1"
            }
          />
        </div>
      </div>
      {/* CSS styles for preventing text selection and pointer events */}
      <style jsx>{`
        .select-none {
          user-select: none;
        }

        .pointer-events-none {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default ViewCounter;
