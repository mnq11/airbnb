import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ClientOnly from "./components/ClientOnly";
import ModalsProvider from "./providers/ModalsProvider";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import { reportWebVitals } from "@/app/libs/webVitals";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";

// Import the next/script component to add security headers via CSP
import Script from "next/script";

/**
 * Application Metadata
 *
 * Defines metadata for the application that will be used in the HTML head section.
 * This includes the site title and description for SEO purposes.
 */
export const metadata: Metadata = {
  title: "منصة تأجير العقارات",
  description: "منصة تأجير العقارات في اليمن",
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
 * Report web vitals to analytics
 *
 * This function is automatically called by Next.js
 */
export { reportWebVitals };

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
    <html lang="ar" dir="rtl">
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
        {/* Add Content Security Policy */}
        <Script id="security-headers">
          {`
            if (window.parent !== window) {
              window.parent.postMessage('*', { targetOrigin: '*' });
            }
          `}
        </Script>
        
        <ErrorBoundary>
          <ClientOnly>
            <ToasterProvider />
            <ModalsProvider />
            <Navbar currentUser={currentUser} />
          </ClientOnly>
          {/* Main content area with padding for header and footer */}
          <div className="flex-grow pb-20 pt-28">{children}</div>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
