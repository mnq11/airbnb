/**
 * Loading Component
 *
 * Server component that displays during page transitions and data loading.
 * Uses Next.js App Router's built-in loading state support to show
 * a spinner or loading indicator automatically when navigating between routes
 * or while data is being fetched.
 *
 * @component
 * @returns {JSX.Element} Loader component showing a loading spinner
 */
import Loader from "@/app/components/Loader";

const Loading = () => {
  return <Loader />;
};

export default Loading;
