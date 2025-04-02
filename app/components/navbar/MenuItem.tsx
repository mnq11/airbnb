"use client";

/**
 * Interface for MenuItem component props
 *
 * @interface MenuItemProps
 * @property {() => void} onClick - Callback function triggered when the menu item is clicked
 * @property {string} label - Text label displayed within the menu item
 * @property {React.ElementType} icon - Icon component to display alongside the label
 */
interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon: React.ElementType;
}

/**
 * MenuItem Component
 *
 * A reusable menu item component used within dropdown menus throughout the application.
 * Each menu item displays an icon followed by a text label and responds to click events.
 *
 * Features:
 * - Consistent styling with hover effects
 * - Icon + text pairing for better visual recognition
 * - Touch/click target area optimization
 * - Used in UserMenu and other navigation components
 *
 * @component
 * @param {MenuItemProps} props - Component props
 * @returns {JSX.Element} Rendered menu item with icon and label
 */
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon: Icon }) => {
  return (
    <div
      onClick={onClick}
      className="
        px-4
        py-3
        hover:bg-neutral-100
        transition
        font-semibold
        flex items-center gap-2
      "
    >
      <Icon className="text-xl" />
      {label}
    </div>
  );
};

export default MenuItem;
