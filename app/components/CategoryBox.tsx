"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

/**
 * Interface for CategoryBox component props
 * 
 * @interface CategoryBoxProps
 * @property {IconType} icon - React icon component to display for the category
 * @property {string} label - Text label for the category, also used as filter value
 * @property {boolean} [selected] - Whether this category is currently selected/active
 */
interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

/**
 * CategoryBox Component
 * 
 * A clickable category filter component used in the navbar to allow users to filter
 * property listings by category type. This component handles both the visual representation
 * of categories and the URL query parameter logic for filtering.
 * 
 * Features:
 * - Click handling with query string parameter updates
 * - Visual styling for selected/unselected states
 * - Icon and text label display
 * - Automatic URL navigation when clicked
 * - Preserves other existing query parameters while toggling category
 * - Resets to page 1 when changing category filters
 * 
 * @component
 * @param {CategoryBoxProps} props - Component props
 * @returns {JSX.Element} Rendered category filter button
 */
const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  /**
   * Handles click on the category box
   * Updates URL query parameters and navigates to filtered results
   */
  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
      page: 1, // Reset to page 1 when category changes
    };

    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true },
    );

    router.push(url);
  }, [label, router, params]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
        p-3
        border-b-4
        rounded
        hover:bg-blue-100
        transition
        cursor-pointer
        ${selected ? "border-blue-600" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
