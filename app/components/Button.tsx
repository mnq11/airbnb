"use client";

import { IconType } from "react-icons";

/**
 * Interface for Button component props
 * @interface ButtonProps
 * @property {string} label - Text to display inside the button
 * @property {Function} onClick - Event handler function for button click events
 * @property {boolean} [disabled] - Optional flag to disable the button
 * @property {boolean} [outline] - Optional flag to render the button with outline style
 * @property {boolean} [small] - Optional flag to render the button in small size
 * @property {IconType} [icon] - Optional React icon component to display with the button
 */
interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

/**
 * Reusable Button component
 *
 * A customizable button component that supports different styles (outline/filled),
 * sizes (small/normal), disabled state, and an optional icon.
 *
 * @component
 * @param {ButtonProps} props - The button properties
 * @returns {JSX.Element} Rendered Button component
 */
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? "bg-white" : "bg-rose-500"}
        ${outline ? "border-black" : "border-rose-500"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "py-1" : "py-3"}
        ${small ? "font-light" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      {label}
    </button>
  );
};

export default Button;
