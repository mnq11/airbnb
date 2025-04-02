"use client";

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import {
  FaUser,
  FaHeart,
  FaCalendarCheck,
  FaHome,
  FaPlus,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaFileAlt, 
} from "react-icons/fa";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

/**
 * Interface for UserMenu component props
 * 
 * @interface UserMenuProps
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 */
interface UserMenuProps {
  currentUser?: SafeUser | null;
}

/**
 * UserMenu Component
 * 
 * A dropdown menu component in the navbar that provides user authentication 
 * and navigation options. It adapts its content based on authentication state.
 * 
 * Features:
 * - Responsive design with mobile and desktop layouts
 * - Dynamic menu content based on authentication state
 * - Profile avatar display when user is logged in
 * - Quick access to property listings, trips, favorites, and reservations
 * - Authentication actions (login, register, sign out)
 * - Loading indicator during navigation or authentication actions
 * - "Add Property" shortcut button
 * - Support for RTL layout and Arabic text
 * 
 * @component
 * @param {UserMenuProps} props - Component props
 * @returns {JSX.Element} Rendered user menu dropdown
 */
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  
  /**
   * Toggles the dropdown menu open/closed state
   */
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  
  /**
   * Handles the "Add Property" button click
   * Opens login modal if user is not authenticated, otherwise opens rent modal
   */
  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  /**
   * Handles menu item clicks with loading state
   * Shows loading spinner during navigation or authentication actions
   * 
   * @param {() => void | Promise<void>} action - Function to execute when menu item is clicked
   */
  const handleMenuItemClick = useCallback(
      async (action: () => void | Promise<void>) => {
        setIsLoading(true);
        await action();
        setIsLoading(false);
        toggleOpen();
      },
      [toggleOpen],
  );

  // Loading state for menu actions
  const [isLoading, setIsLoading] = useState(false);

  return (
      <div className="relative">
        {/* User menu trigger - Add Property button and avatar/menu toggle */}
        <div className="flex flex-row items-center gap-3">
          {/* Add Property button - visible only on larger screens */}
          <div
              onClick={onRent}
              className="
            hidden
            md:block
            text-sm
            font-semibold
            py-3
            px-4
            rounded-full
            hover:bg-neutral-100
            transition
            cursor-pointer
          "
          >
            أضف عقار
          </div>
          
          {/* Menu toggle button with hamburger icon and avatar */}
          <div
              onClick={toggleOpen}
              className="
          p-4
          md:py-1
          md:px-2
          border-[1px]
          border-neutral-200
          flex
          flex-row
          items-center
          gap-3
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          "
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar src={currentUser?.image} />
            </div>
          </div>
        </div>
        
        {/* Dropdown menu - conditionally rendered when isOpen is true */}
        {isOpen && (
            <div
                className="
       absolute
      rounded-xl
      shadow-md
      w-auto
      md:w-3/4
      min-w-[200px]
      max-w-[40vw]
      bg-white
      overflow-hidden
      left-1
      top-12
      text-sm
    "
            >
              <div className="flex flex-col cursor-pointer">
                {/* Loading spinner state */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <ClipLoader color="#000" loading={isLoading} size={30} />
                    </div>
                ) : (
                    <>
                      {/* Authenticated user menu options */}
                      {currentUser ? (
                          <>
                            <MenuItem
                                label="الرئيسية"
                                icon={FaUser}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/"))
                                }
                            />
                            <MenuItem
                                label="رحلات قمت بحجزها"
                                icon={FaCalendarCheck}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/trips"))
                                }
                            />
                            <MenuItem
                                label="اماكن مفضلة"
                                icon={FaHeart}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/favorites"))
                                }
                            />
                            <MenuItem
                                label="حجوزات"
                                icon={FaCalendarCheck}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/reservations"))
                                }
                            />
                            <MenuItem
                                label="العقارات المدرجة"
                                icon={FaHome}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/properties"))
                                }
                            />
                            <MenuItem
                                label="أضف عقار"
                                icon={FaPlus}
                                onClick={() => handleMenuItemClick(() => onRent())}
                            />
                            <hr />
                            <MenuItem
                                label="سياسة الخصوصية"
                                icon={FaFileAlt}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/PrivacyPolicy"))
                                }
                            />
                            <MenuItem
                                label="تسجيل خروج"
                                icon={FaSignOutAlt}
                                onClick={() => handleMenuItemClick(() => signOut())}
                            />
                          </>
                      ) : (
                          <>
                            {/* Guest user menu options */}
                            <MenuItem
                                label=" دخول"
                                icon={FaSignInAlt}
                                onClick={() =>
                                    handleMenuItemClick(() => loginModal.onOpen())
                                }
                            />
                            <MenuItem
                                label="تسجيل"
                                icon={FaUserPlus}
                                onClick={() =>
                                    handleMenuItemClick(() => registerModal.onOpen())
                                }
                            />
                            <MenuItem
                                label="سياسة الخصوصية"
                                icon={FaFileAlt}
                                onClick={() =>
                                    handleMenuItemClick(() => router.push("/PrivacyPolicy"))
                                }
                            />
                          </>
                      )}
                    </>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default UserMenu;
