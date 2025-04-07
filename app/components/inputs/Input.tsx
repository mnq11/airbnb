"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

/**
 * Interface for Input component props
 *
 * This component is designed to work with react-hook-form for form validation
 * and state management.
 *
 * @interface InputProps
 * @property {string} id - Unique identifier for the input, used for form registration and error handling
 * @property {string} label - Label text displayed for the input field
 * @property {string} [type="text"] - HTML input type attribute (text, email, password, etc.)
 * @property {boolean} [disabled] - When true, disables the input field
 * @property {boolean} [formatPrice] - When true, displays a currency symbol and formats the input as a price
 * @property {boolean} [required] - When true, marks the field as required for form validation
 * @property {UseFormRegister<FieldValues>} register - react-hook-form register function for field registration
 * @property {FieldErrors} errors - react-hook-form errors object for displaying validation errors
 * @property {"ltr"|"rtl"} [textDirection="ltr"] - Text direction for the input (left-to-right or right-to-left)
 */
export interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  textDirection?: "ltr" | "rtl";
}

/**
 * Input Component
 *
 * A standardized form input component with floating label, validation styling,
 * and optional price formatting. This component is designed to be used with
 * react-hook-form for consistent form handling throughout the application.
 *
 * Features:
 * - Floating label animation that moves when the field is focused or filled
 * - Error state styling with red borders and label color
 * - Optional price formatting with currency symbol
 * - RTL/LTR text direction support
 * - Disabled state styling and functionality
 * - Consistent styling with the application design system
 *
 * @component
 * @param {InputProps} props - Component props
 * @returns {JSX.Element} Rendered input field with floating label
 */
const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  textDirection = "ltr",
}) => {
  return (
    <div className="w-full relative">
      {/* Currency symbol for price inputs */}
      {formatPrice && (
        <BiDollar
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}

      {/* Input field */}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" " /* Empty placeholder required for floating label CSS */
        type={type}
        dir={textDirection}
        className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />

      {/* Floating label with animation and error styling */}
      <label
        className={`
          absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
