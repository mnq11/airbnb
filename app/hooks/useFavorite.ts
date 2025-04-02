/**
 * Custom hook for managing property listing favorites
 * 
 * This hook provides utilities to check if a listing has been favorited by the current user
 * and to toggle the favorite status with appropriate API calls and UI feedback.
 * 
 * @module hooks/useFavorite
 */

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

/**
 * Interface for the useFavorite hook parameters
 * 
 * @interface IUseFavorite
 * @property {string} listingId - ID of the listing to check/toggle favorite status
 * @property {SafeUser|null} [currentUser] - Currently authenticated user or null if not logged in
 */
interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

/**
 * Hook for managing favorite status of a listing
 * 
 * Provides functions to check if the current user has favorited a listing 
 * and to toggle the favorite status with proper authentication handling.
 * 
 * @param {IUseFavorite} params - Parameters containing listing ID and current user
 * @returns {Object} Object with favorite status and toggle function
 * @returns {boolean} hasFavorited - Whether the listing is favorited by current user
 * @returns {Function} toggleFavorite - Function to toggle favorite status
 */
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  /**
   * Determines if the current listing is favorited by the user
   * 
   * @type {boolean}
   */
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  /**
   * Toggles the favorite status of the listing
   * 
   * If user is not logged in, opens the login modal instead.
   * Performs API call to add/remove from favorites and shows feedback toast.
   * 
   * @async
   * @param {React.MouseEvent<HTMLDivElement>} e - Click event
   */
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        await request();
        router.refresh();
        toast.success("نجاح");
      } catch (error) {
        toast.error("هناك خطأ ما");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router],
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
