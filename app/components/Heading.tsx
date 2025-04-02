"use client";

/**
 * Interface for Heading component props
 * 
 * @interface HeadingProps
 * @property {string} title - The main heading text to display
 * @property {string} [subtitle] - Optional secondary text to display below the title
 * @property {boolean} [center] - Optional flag to center-align the heading (defaults to left/start alignment)
 */
interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

/**
 * Heading Component
 * 
 * A reusable component for displaying consistent section headings throughout the application.
 * Supports a main title and optional subtitle with configurable text alignment.
 * 
 * Used for:
 * - Section titles
 * - Modal headings
 * - Empty state messages
 * - Form headings
 * 
 * @component
 * @param {HeadingProps} props - The component props
 * @returns {JSX.Element} Rendered heading with title and optional subtitle
 */
const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold text-center">{title}</div>
      <div className="font-light text-neutral-500 mt-2 text-center">
        {subtitle}
      </div>
    </div>
  );
};

export default Heading;
