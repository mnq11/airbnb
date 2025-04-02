/**
 * NextAuth Middleware Configuration
 * 
 * This file configures NextAuth's middleware to protect specified routes.
 * Protected routes will automatically redirect unauthenticated users to the login page.
 * 
 * The default export from 'next-auth/middleware' handles the authentication checks
 * and redirects based on the session status.
 */
export { default } from "next-auth/middleware";

/**
 * Route Matcher Configuration
 * 
 * Specifies which routes should be protected by the NextAuth middleware.
 * Only routes that match these patterns will require authentication.
 * 
 * @property {string[]} matcher - Array of route patterns that require authentication
 */
export const config = {
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites",
    "/PrivacyPolicy",
  ],
};
