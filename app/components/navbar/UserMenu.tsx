'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  const handleMenuItemClick = useCallback(
      (action: () => void) => {
        action();
        toggleOpen();
      },
      [toggleOpen]
  );

  return ( 
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
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
      {isOpen && (
        <div 
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem 
                  label="رحلات قمت بحجزها"
                  onClick={() => handleMenuItemClick(() => router.push('/trips'))}
                />
                <MenuItem 
                  label="اماكن مفضلة"
                  onClick={() => handleMenuItemClick(() => router.push('/favorites'))}

                />
                <MenuItem 
                  label="حجوزات"
                  onClick={() => handleMenuItemClick(() => router.push('/reservations'))}

                />
                <MenuItem 
                  label="العقارات المدرجة"
                  onClick={() => handleMenuItemClick(() => router.push('/properties'))}

                />
                <MenuItem 
                  label="أضف عقار"
                  // onClick={rentModal.onOpen}
                  onClick={() => handleMenuItemClick(() => onRent())}

                />
                <hr />
                <MenuItem 
                  label="تسجيل خروج"
                  onClick={() => handleMenuItemClick(() => signOut())}

                />
              </>
            ) : (
              <>
                <MenuItem 
                  label="تسجيل دخول"
                  onClick={() => handleMenuItemClick(() => loginModal.onOpen())}

                />
                <MenuItem 
                  label="تسجيل"
                  onClick={() => handleMenuItemClick(() => registerModal.onOpen())}

                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
   );
}
 
export default UserMenu;