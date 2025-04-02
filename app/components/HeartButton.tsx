import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";
import React from "react";

/**
 * Interface for HeartButton component props
 *
 * @interface HeartButtonProps
 * @property {string} listingId - Unique identifier for the property listing
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 * @property {number} [favoritesCount] - Number of users who have favorited this listing
 */
interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
  favoritesCount?: number;
}

/**
 * HeartButton Component
 *
 * An interactive button that allows users to favorite/unfavorite property listings.
 * Displays both the favorite status and the total count of favorites for a listing.
 *
 * Features:
 * - Visual indication of favorite status (filled heart when favorited)
 * - Display of total favorites count
 * - Toggle functionality to add/remove favorites
 * - Proper authentication handling (redirects to login if user not authenticated)
 * - Optimistic UI updates for better user experience
 *
 * Uses the useFavorite custom hook to handle the favorite state and API interactions.
 *
 * @component
 * @param {HeartButtonProps} props - Component props
 * @returns {JSX.Element} Rendered heart button with favorite status and count
 */
const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
  favoritesCount,
}) => {
  // Use custom hook to get favorite status and toggle function
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser,
  });

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer z-10"
    >
      <div className="flex flex-col items-center">
        {/* Filled heart with conditional color based on favorite status */}
        <AiFillHeart
          size={24}
          className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
        />
        {/* Outline heart creates a border effect */}
        <AiOutlineHeart
          size={28}
          className="fill-white absolute -top-[2px] -right-[-10px]"
        />
      </div>
      {/* Favorites count display with Arabic numeral formatting */}
      <div className="w-12 text-center">
        <div className="bg-white bg-opacity-50 rounded-md py-0.5 px-1.5 font-extrabold text-rose-500 select-none pointer-events-none">
          {` ${(favoritesCount || 0).toLocaleString("ar-EG")}`}
        </div>
      </div>
      <style jsx>{`
        .select-none {
          user-select: none;
        }
        .pointer-events-none {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default HeartButton;
