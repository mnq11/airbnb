/**
 * Custom hook for managing registration modal state
 * 
 * Uses Zustand to create a store that manages the visibility state of the registration modal
 * throughout the application. Provides functions to open and close the modal.
 * 
 * @module hooks/useRegisterModal
 */

import { create } from "zustand";

/**
 * Interface defining the registration modal store structure
 * 
 * @interface RegisterModalStore
 * @property {boolean} isOpen - Whether the registration modal is currently visible
 * @property {Function} onOpen - Function to open the registration modal
 * @property {Function} onClose - Function to close the registration modal
 */
interface RegisterModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Zustand store hook for registration modal state management
 * 
 * @type {UseBoundStore<RegisterModalStore>}
 */
const useRegisterModal = create<RegisterModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRegisterModal;
