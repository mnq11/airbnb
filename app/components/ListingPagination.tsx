"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import { SafeListing, SafeUser } from "@/app/types";
import Pagination from "@/app/components/listings/Pagination";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Interface for ListingPagination component props
 *
 * @interface ListingPaginationProps
 * @property {SafeListing[]} initialListings - Initial array of listings to display
 * @property {number} initialPage - Starting page number for pagination
 * @property {number} totalPages - Total number of pages available
 * @property {SafeUser|null} currentUser - Current authenticated user data or null if not logged in
 * @property {Record<string, any>} searchParams - Search/filter parameters for listings
 */
interface ListingPaginationProps {
  initialListings: SafeListing[];
  initialPage: number;
  totalPages: number;
  currentUser: SafeUser | null;
  searchParams: Record<string, any>;
}

/**
 * ListingPagination Component
 *
 * A client component that handles the display and pagination of property listings.
 * This component is responsible for:
 * - Rendering a grid of listing cards
 * - Managing pagination state and navigation
 * - Fetching new listing data when page changes
 * - Updating the URL with the current page and search parameters
 * - Displaying an empty state when no listings are found
 *
 * The component maintains pagination state and fetches new data from the API
 * when the page changes, providing a smooth browsing experience without full
 * page reloads.
 *
 * @component
 * @param {ListingPaginationProps} props - Component props
 * @returns {JSX.Element} Rendered grid of listings with pagination controls or empty state
 */
const ListingPagination: React.FC<ListingPaginationProps> = ({
  initialListings,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  // State for current page and listings data
  const [page, setPage] = useState(initialPage);
  const [listings, setListings] = useState(initialListings);
  const router = useRouter();
  const params = useSearchParams();
  const limit = 10; // Number of listings per page

  /**
   * Effect to fetch new listings when page or search parameters change
   * Makes an API request to get the listings for the current page and filters
   */
  useEffect(() => {
    const fetchListings = async () => {
      const query = qs.stringify({ ...searchParams, page, limit });
      const response = await fetch(`/api/listings?${query}`);
      const data = await response.json();
      setListings(data.listings);
    };

    fetchListings();
  }, [page, searchParams]);

  /**
   * Handler for page change events from the pagination component
   * Updates page state and pushes new URL with updated query parameters
   *
   * @param {number} newPage - The new page number to navigate to
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = qs.stringify({ ...searchParams, page: newPage });
    router.push(`/?${query}`);
  };

  /**
   * Effect to synchronize component state with URL parameters
   * Updates the page state when the URL parameters change
   */
  useEffect(() => {
    const currentPage = params?.get("page");
    if (currentPage) {
      setPage(Number(currentPage));
    }
  }, [params]);

  // If no listings are found, display the empty state component
  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      {/* Responsive grid layout for listing cards */}
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => {
          const imageSrcs = listing.images.map((image) => image.url);
          return (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              imageSrcs={imageSrcs}
            />
          );
        })}
      </div>
      {/* Pagination controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ListingPagination;
