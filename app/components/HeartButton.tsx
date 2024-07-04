import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";
import React from "react";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
  favoritesCount?: number;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
  favoritesCount,
}) => {
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
        <AiFillHeart
          size={24}
          className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
        />
        <AiOutlineHeart
          size={28}
          className="fill-white absolute -top-[2px] -right-[-10px]"
        />
      </div>
      {/* Update the favoritesCount display */}
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
