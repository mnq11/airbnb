/**
 * ToasterProvider Component
 * 
 * Client component that provides toast notification functionality throughout the application.
 * Wraps react-hot-toast's Toaster component so it can be used with Next.js App Router.
 * Ensures toast notifications appear consistently across all pages without needing
 * to add the Toaster component to each page individually.
 * 
 * @component
 * @returns {JSX.Element} Toaster component for showing notifications
 */
"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return <Toaster />;
};

export default ToasterProvider;
