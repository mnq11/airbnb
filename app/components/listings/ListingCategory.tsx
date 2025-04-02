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
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon size={40} className="text-neutral-600" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{label}</div>
          <div className="text-neutral-500 font-light">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
