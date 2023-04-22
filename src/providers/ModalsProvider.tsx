'use client';

import LoginModal from "@/src/components/modals/LoginModal";
import RegisterModal from "@/src/components/modals/RegisterModal";
import RentModal from "@/src/components/modals/RentModal";
import SearchModal from "@/src/components/modals/SearchModal";

const ModalsProvider = () => {
  return ( 
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <RentModal />
    </>
   );
}
 
export default ModalsProvider;