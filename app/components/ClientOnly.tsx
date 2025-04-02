// app/components/ClientOnly.tsx
"use client";

import React, { useState, useEffect } from "react";

/**
 * Interface for ClientOnly component props
 *
 * @interface ClientOnlyProps
 * @property {React.ReactNode} children - Child components to render after client-side mounting
 */
interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * ClientOnly Component
 *
 * This component prevents hydration errors by only rendering its children on the client side.
 * It waits until the component has mounted in the browser before rendering children,
 * which helps avoid React hydration mismatches between server and client rendering.
 *
 * Use this wrapper for components that:
 * - Access browser-only APIs (window, localStorage, etc.)
 * - Need DOM measurement
 * - Use third-party libraries that depend on browser environment
 *
 * @component
 * @param {ClientOnlyProps} props - The component props
 * @returns {JSX.Element | null} - The children when mounted, or null during server rendering
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  // Set mounted state to true after component mounts on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Return null on first render (server-side) to prevent hydration issues
  if (!hasMounted) return null;

  // Render children only after client-side mount
  return <>{children}</>;
};

export default ClientOnly;
