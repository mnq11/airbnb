/**
 * Logo Component
 * 
 * Client component that displays the site logo in the navigation bar.
 * The logo is only visible on medium and larger screens and serves as a link to the homepage.
 * 
 * Features:
 * - Responsive display (hidden on mobile)
 * - Click navigation to homepage
 * - Image optimization with Next.js Image component
 * 
 * @component
 * @returns {JSX.Element} Rendered logo image with navigation functionality
 */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      className="hidden md:block cursor-pointer"
      src="/images/logo.png"
      height="100"
      width="100"
      alt="Logo"
    />
  );
};

export default Logo;
