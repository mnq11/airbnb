'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Image
      onClick={() => router.push('/')}
      className="hidden md:block cursor-pointer" 
      src="/images/Rhlh-4-17-2023.png"
      height="100" 
      width="100" 
      alt="Logo" 
    />
   );
}
 
export default Logo;
