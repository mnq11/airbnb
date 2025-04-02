"use client";

import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import React from "react";

/**
 * Interface for Navbar component props
 * 
 * @interface NavbarProps
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 */
interface NavbarProps {
  currentUser?: SafeUser | null;
}

/**
 * Navbar Component
 * 
 * The main navigation header component that appears at the top of every page.
 * Provides navigation, search functionality, user menu, and category filtering.
 * 
 * Features:
 * - Fixed positioning at the top of the viewport
 * - Logo with homepage navigation
 * - Search bar for property listings
 * - User menu with authentication and profile options
 * - Categories navigation bar for filtering properties
 * - Responsive layout that adapts to different screen sizes
 * - Elevated z-index to ensure it appears above other content
 * - Shadow effect for visual separation
 * 
 * The component is structured in two sections:
 * 1. Main navbar with logo, search, and user menu
 * 2. Categories bar below for property type filtering
 * 
 * @component
 * @param {NavbarProps} props - Component props
 * @returns {JSX.Element} Rendered navigation header
 */
const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <div className="fixed w-full bg-white z-20 shadow-sm">
      {/* Main navbar section with logo, search and user menu */}
      <div
        className="
          py-4
          border-b-[1px]
        "
      >
        <Container>
          <div
            className="
            flex
            flex-row
            items-center
            justify-between
            gap-3
            md:gap-0
          "
          >
            {/* Logo component linked to homepage */}
            <Logo />
            
            {/* Search bar for property listings */}
            <Search />
            
            {/* User menu with authentication and profile options */}
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      
      {/* Categories bar for property type filtering */}
      <Categories />
    </div>
  );
};

export default Navbar;
