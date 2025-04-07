/**
 * Custom hook for managing property rental form modal state
 *
 * Uses Zustand to create a store that manages the visibility state of the
 * rental property creation modal throughout the application.
 * Provides functions to open and close the modal.
 *
 * @module hooks/useRentModal
 */

import { create } from "zustand";

/**
 * Interface defining the rent modal store structure
 *
 * @interface RentModalStore
 * @property {boolean} isOpen - Whether the property rental modal is currently visible
 * @property {Function} onOpen - Function to open the property rental modal
 * @property {Function} onClose - Function to close the property rental modal
 */
interface RentModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Zustand store hook for property rental modal state management
 *
 * @type {UseBoundStore<RentModalStore>}
 */
const useRentModal = create<RentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRentModal;
