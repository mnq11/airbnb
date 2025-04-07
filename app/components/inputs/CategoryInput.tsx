"use client";

import { IconType } from "react-icons";

/**
 * Interface for CategoryBox form input component props
 *
 * @interface CategoryBoxProps
 * @property {IconType} icon - React icon component to display for the category
 * @property {string} label - Text label for the category
 * @property {boolean} [selected] - Whether this category is currently selected
 * @property {(value: string) => void} onClick - Callback function when category is clicked, receives label as parameter
 */
interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

/**
 * CategoryBox Component
 *
 * A form input component used in the RentModal for property category selection.
 * Displays a selectable box with an icon and label that changes appearance when selected.
 * Used for categorizing property listings (e.g., Beach, Windmills, Modern, etc.).
 *
 * Features:
 * - Visual indication of selected state with color changes
 * - Icon and text pairing for better UX
 * - Click handler that passes the category label to parent component
 * - Consistent styling with other form components
 *
 * @component
 * @param {CategoryBoxProps} props - Component props
 * @returns {JSX.Element} Rendered category input box
 */
const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer ${
        selected
          ? "border-red-400 bg-red-100 text-red-600"
          : "border-neutral-200"
      }`}
    >
      <Icon size={30} style={{ color: selected ? "red" : "black" }} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryBox;
