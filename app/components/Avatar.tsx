"use client";

import Image from "next/image";

/**
 * Interface for Avatar component props
 *
 * @interface AvatarProps
 * @property {string|null|undefined} src - URL path to the avatar image
 *                                         Will use placeholder if null/undefined
 */
interface AvatarProps {
  src: string | null | undefined;
}

/**
 * Avatar Component
 *
 * A reusable component that displays a user's profile avatar image.
 * The component:
 * - Renders a circular image using Tailwind's rounded-full class
 * - Has fixed dimensions of 30x30 pixels
 * - Uses Next.js Image component for optimized loading
 * - Falls back to a placeholder image if no source is provided
 *
 * Used throughout the application for user avatars in:
 * - Navigation bar user menu
 * - User profile displays
 * - Comment/review sections
 * - Messaging interfaces
 *
 * @component
 * @param {AvatarProps} props - The component props
 * @returns {JSX.Element} Rendered circular avatar image
 */
const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      className="rounded-full"
      height="30"
      width="30"
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
    />
  );
};

export default Avatar;
