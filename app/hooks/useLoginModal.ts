/**
 * Custom hook for managing login modal state
 *
 * Uses Zustand to create a store that manages the visibility state of the login modal
 * throughout the application. Provides functions to open and close the modal.
 *
 * @module hooks/useLoginModal
 */

import { create } from "zustand";

/**
 * Interface defining the login modal store structure
 *
 * @interface LoginModalStore
 * @property {boolean} isOpen - Whether the login modal is currently visible
 * @property {Function} onOpen - Function to open the login modal
 * @property {Function} onClose - Function to close the login modal
 */
interface LoginModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Zustand store hook for login modal state management
 *
 * @type {UseBoundStore<LoginModalStore>}
 */
const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useLoginModal;
