'use client';

import {useCallback, useState} from "react";
import {AiOutlineMenu} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { FaUser, FaHeart, FaCalendarCheck, FaHome, FaPlus, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import {SafeUser} from "@/app/types";

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
        async (action: () => void | Promise<void>) => {
            setIsLoading(true);
            await action();
            setIsLoading(false);
            toggleOpen();
        },
        [toggleOpen]
    );

    const [isLoading, setIsLoading] = useState(false);

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
                    <AiOutlineMenu/>
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image}/>
                    </div>
                </div>
            </div>
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
                        {isLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <ClipLoader color="#000" loading={isLoading} size={30}/>
                            </div>
                        ) : (
                            <>
                                {currentUser ? (
                                    <>
                                        <MenuItem
                                            label="الرئيسية"
                                            icon={FaUser}
                                            onClick={() => handleMenuItemClick(() => router.push('/'))}
                                        />

                                        <MenuItem
                                            label="رحلات قمت بحجزها"
                                            icon={FaCalendarCheck}
                                            onClick={() => handleMenuItemClick(() => router.push('/trips'))}
                                        />
                                        <MenuItem
                                            label="اماكن مفضلة"
                                            icon={FaHeart}
                                            onClick={() => handleMenuItemClick(() => router.push('/favorites'))}
                                        />
                                        <MenuItem
                                            label="حجوزات"
                                            icon={FaCalendarCheck}
                                            onClick={() => handleMenuItemClick(() => router.push('/reservations'))}
                                        />
                                        <MenuItem
                                            label="العقارات المدرجة"
                                            icon={FaHome}
                                            onClick={() => handleMenuItemClick(() => router.push('/properties'))}
                                        />
                                        <MenuItem
                                            label="أضف عقار"
                                            icon={FaPlus}
                                            onClick={() => handleMenuItemClick(() => onRent())}
                                        />
                                        <hr/>
                                        <MenuItem
                                            label="تسجيل خروج"
                                            icon={FaSignOutAlt}
                                            onClick={() => handleMenuItemClick(() => signOut())}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <MenuItem
                                            label=" دخول"
                                            icon={FaSignInAlt}
                                            onClick={() => handleMenuItemClick(() => loginModal.onOpen())}
                                        />
                                        <MenuItem
                                            label="تسجيل"
                                            icon={FaUserPlus}
                                            onClick={() => handleMenuItemClick(() => registerModal.onOpen())}
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
}
export default UserMenu;