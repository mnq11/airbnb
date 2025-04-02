"use client";

/**
 * Interface for Container component props
 * 
 * @interface ContainerProps
 * @property {React.ReactNode} children - Child elements to be rendered inside the container
 */
interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Container Component
 * 
 * A fundamental layout component that provides consistent spacing and alignment
 * throughout the application. This component:
 * - Creates a responsive container with maximum width constraints
 * - Applies horizontal padding that scales with viewport size
 * - Sets RTL (right-to-left) direction for Arabic language support
 * - Right-aligns text content for proper RTL reading flow
 * 
 * Used as a wrapper for page and section content to maintain visual consistency
 * and proper spacing across different screen sizes.
 * 
 * @component
 * @param {ContainerProps} props - Component props
 * @returns {JSX.Element} Rendered container with children
 */
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      dir="rtl" // Add the dir attribute here
      className="
        text-right // Add the 'text-right' class here
        max-w-[2520px]
        mx-auto
        xl:px-20
        md:px-10
        sm:px-2
        px-4
      "
    >
      {children}
    </div>
  );
};

export default Container;
