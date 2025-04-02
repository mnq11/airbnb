/**
 * ModalsProvider Component
 *
 * Client component that serves as a central provider for all modal dialogs in the application.
 * Renders all modal components in a single place to ensure they're available throughout the app
 * without needing to add them to individual pages.
 *
 * Includes:
 * - LoginModal: For user authentication
 * - RegisterModal: For new user registration
 * - SearchModal: For property search filters
 * - RentModal: For creating new property listings
 *
 * @component
 * @returns {JSX.Element} Fragment containing all modal components
 */
"use client";

import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import RentModal from "../components/modals/RentModal";
import SearchModal from "../components/modals/SearchModal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <RentModal />
    </>
  );
};

export default ModalsProvider;
