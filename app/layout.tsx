import { Nunito } from "next/font/google";

import Navbar from "@/app/components/navbar/Navbar";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";
import SearchModal from "@/app/components/modals/SearchModal";
import RentModal from "@/app/components/modals/RentModal";

import ToasterProvider from "@/app/providers/ToasterProvider";
import Footer from "@/app/components/Footer";

import "./globals.css";
import ClientOnly from "./components/ClientOnly";
import getCurrentUser from "./actions/getCurrentUser";
import React from "react";

/**
 * Application Metadata
 *
 * Defines metadata for the application that will be used in the HTML head section.
 * This includes the site title and description for SEO purposes.
 */
export const metadata = {
  title: "جولتنا",
  description: "منصة جولتنا للتجوال",
};

/**
 * Font Configuration
 *
 * Configures the Nunito font from Google Fonts for use throughout the application.
 * The font is loaded with the Latin subset for optimal performance.
 */
const font = Nunito({
  subsets: ["latin"],
});

/**
 * Root Layout Component
 *
 * The main layout wrapper for the entire application that provides:
 * - Global styling and font application
 * - Navigation header with authentication state
 * - Global modal components (login, register, search, rent)
 * - Toast notifications
 * - Footer component
 *
 * This component is a Server Component that fetches the current user on each request.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Nested page content to be rendered inside the layout
 * @returns {Promise<JSX.Element>} Rendered layout with global components and nested content
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch current user information for authentication-aware components
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-16x16.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <title>جولتنا</title>
      </head>
      <body className={font.className}>
        {/* Client components wrapped in ClientOnly to prevent hydration issues */}
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {/* Main content area with padding for header and footer */}
        <div className="flex-grow pb-20 pt-28">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
