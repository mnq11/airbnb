import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings, { IListingsParams } from "@/app/actions/getListings";
import ListingPagination from "@/app/components/ListingPagination";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

/**
 * Force dynamic rendering for this page to ensure fresh data on each request
 * This prevents static generation and ensures the most up-to-date listings are displayed
 */
export const dynamic = "force-dynamic";

/**
 * Home Page Component - Main entry point of the application
 * 
 * This component serves as the landing page and displays paginated property listings.
 * It handles fetching listings data with search parameters and pagination support.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {IListingsParams} props.searchParams - URL search parameters for filtering listings
 * @returns {Promise<JSX.Element>} Rendered page component with listings or error state
 */
export default async function Home({
  searchParams,
}: {
  searchParams: IListingsParams;
}) {
  // Set default pagination values
  const page = searchParams.page || 1;
  const limit = 10;

  try {
    // Fetch paginated listings data and total count based on search parameters
    const { listings, total } = await getListings({
      ...searchParams,
      page,
      limit,
    });
    
    // Fetch current user information for favoriting functionality
    const currentUser = await getCurrentUser();

    // Calculate total number of pages for pagination
    const totalPages = Math.ceil(total / limit);

    // Render the listings with pagination component
    return (
      <ClientOnly>
        <ListingPagination
          initialListings={listings}
          initialPage={page}
          totalPages={totalPages}
          currentUser={currentUser}
          searchParams={searchParams}
        />
      </ClientOnly>
    );
  } catch (error) {
    // Handle any errors during data fetching and display error state
    console.error("Error fetching data:", error);
    return (
      <ClientOnly>
        <EmptyState title="Error" subtitle="Failed to load listings." />
      </ClientOnly>
    );
  }
}
