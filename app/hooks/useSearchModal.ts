/**
 * Custom hook for managing property search modal state
 *
 * Uses Zustand to create a store that manages the visibility state of the search modal
 * throughout the application. Provides functions to open and close the modal when
 * users want to filter property listings.
 *
 * @module hooks/useSearchModal
 */

import { create } from "zustand";

/**
 * Interface defining the search modal store structure
 *
 * @interface SearchModalStore
 * @property {boolean} isOpen - Whether the search filter modal is currently visible
 * @property {Function} onOpen - Function to open the search filter modal
 * @property {Function} onClose - Function to close the search filter modal
 */
interface SearchModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Zustand store hook for search modal state management
 *
 * @type {UseBoundStore<SearchModalStore>}
 */
const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSearchModal;
