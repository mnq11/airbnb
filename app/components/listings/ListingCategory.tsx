"use client";

import { IconType } from "react-icons";
import React from "react";

/**
 * Interface for CategoryView component props
 *
 * @interface CategoryViewProps
 * @property {IconType} icon - React icon component to display for the category
 * @property {string} label - Text label for the category
 * @property {string} description - Detailed description of what the category represents
 */
interface CategoryViewProps {
  icon: IconType;
  label: string;
  description: string;
}

/**
 * CategoryView Component
 *
 * Displays detailed information about a property's category in the listing details page.
 * Unlike the CategoryBox component used for filtering, this component is for display only
 * and shows both the category label and its detailed description.
 *
 * Features:
 * - Icon, label, and description display in a consistent format
 * - Used within ListingInfo to explain the property category
 * - Maintains consistent styling with the property details section
 * - Read-only display (no interactive elements)
 *
 * @component
 * @param {CategoryViewProps} props - Component props
 * @returns {JSX.Element} Rendered category information
 */
const CategoryView: React.FC<CategoryViewProps> = ({
  icon: Icon,
  label,
  description,
}) => {
  return (
    // Optional: Add padding/background for visual grouping if needed within ListingInfo
    // <div className="p-4 bg-neutral-50 rounded-lg">
    <div className="flex flex-row items-start gap-4 text-right"> {/* Align items start, text-right */} 
      {/* Icon Styling */}
      <Icon size={36} className="text-rose-500 flex-shrink-0 mt-1" /> {/* Use theme color, adjust size/margin */} 
      
      {/* Text Content Styling */}
      <div className="flex flex-col">
        <div className="text-lg font-semibold text-neutral-800"> {/* Darker text for better contrast */} 
          {label}
        </div>
        <div className="text-neutral-600 font-light"> {/* Slightly darker description */} 
          {description}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CategoryView;
