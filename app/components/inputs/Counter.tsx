"use client";
import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

/**
 * Interface for Counter component props
 * 
 * @interface CounterProps
 * @property {string} title - Label displayed above the counter
 * @property {string} subtitle - Secondary text displayed below the title
 * @property {number} value - Current counter value
 * @property {(value: number) => void} onChange - Callback function when value changes
 * @property {number} [min=0] - Minimum allowed value for the counter
 */
interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
  min?: number; // Add a min prop to specify the minimum value
}

/**
 * Counter Component
 * 
 * A numeric input component with increment/decrement buttons used in forms
 * for selecting numeric values like guest count, room count, etc.
 * 
 * Features:
 * - Plus/minus buttons for incrementing and decrementing values
 * - Minimum value enforcement (prevents going below specified minimum)
 * - Title and descriptive subtitle display
 * - Consistent styling with other form inputs
 * - Responsive click targets with hover effects
 * 
 * Used in:
 * - RentModal for selecting property attributes
 * - SearchModal for filtering properties by capacity
 * 
 * @component
 * @param {CounterProps} props - Component props
 * @returns {JSX.Element} Rendered counter input with buttons
 */
const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
  min = 0, // Set the default minimum value to 0
}) => {
  /**
   * Increases the counter value by 1
   */
  const onAdd = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  /**
   * Decreases the counter value by 1 if above minimum
   */
  const onReduce = useCallback(() => {
    if (value > min) {
      // Update the logic to check if value is greater than the minimum value
      onChange(value - 1);
    }
  }, [onChange, value, min]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium text-center">{title}</div>
        <div className="font-light text-gray-600 text-center">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          onClick={onReduce}
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            border-neutral-400
            flex
            items-center
            justify-center
            text-neutral-600
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlineMinus />
        </div>
        <div
          className="
            font-light
            text-xl
            text-neutral-600
          "
        >
          {value}
        </div>
        <div
          onClick={onAdd}
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            border-neutral-400
            flex
            items-center
            justify-center
            text-neutral-600
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          <AiOutlinePlus />
        </div>
      </div>
    </div>
  );
};

export default Counter;
