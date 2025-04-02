"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SafeListing, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";
import EmptyState from "@/app/components/EmptyState";

/**
 * Interface for PropertiesClient component props
 *
 * @interface PropertiesClientProps
 * @property {SafeListing[]} initialListings - Array of property listings owned by the current user
 * @property {number} initialPage - Starting page number for pagination
 * @property {number} totalPages - Total number of pages available for pagination
 * @property {SafeUser|null} currentUser - Current authenticated user data or null if not logged in
 * @property {Record<string, any>} searchParams - URL search parameters for filtering
 */
interface PropertiesClientProps {
  initialListings: SafeListing[];
  initialPage: number;
  totalPages: number;
  currentUser: SafeUser | null;
  searchParams: Record<string, any>;
}

/**
 * PropertiesClient Component
 *
 * Client component that displays properties owned by the current user with
 * pagination and deletion functionality.
 *
 * Features:
 * - Responsive grid layout for property cards
 * - Property deletion with confirmation and loading state
 * - Pagination with server-side data fetching
 * - Arabic localization for headings and actions
 * - URL-based state management for sharing and navigation
 *
 * @component
 * @param {PropertiesClientProps} props - Component props
 * @returns {JSX.Element} Rendered grid of user's property listings with pagination
 */
const PropertiesClient: React.FC<PropertiesClientProps> = ({
  initialListings,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [page, setPage] = useState(initialPage);
  const [deletingId, setDeletingId] = useState("");

  /**
   * Fetch listings when page or search parameters change
   */
  useEffect(() => {
    const fetchListings = async () => {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        userId: currentUser?.id || "",
      }).toString();
      const response = await axios.get(`/api/listings?${queryParams}`);
      setListings(response.data.listings);
    };

    fetchListings();
  }, [page, searchParams, currentUser?.id]);

  /**
   * Handles property deletion
   *
   * @param {string} id - ID of the property to delete
   */
  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("حذفت العقار بنجاح");
            router.refresh();
          } else {
            toast.error(`Error: ${response.status}`);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "An error occurred");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  /**
   * Handles page change in pagination
   * Updates URL and fetches new page data
   *
   * @param {number} newPage - New page number to display
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = new URLSearchParams({
      ...searchParams,
      page: newPage.toString(),
      userId: currentUser?.id || "",
    }).toString();
    router.push(`/properties?${query}`);
  };

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <Heading title="العقارات" subtitle="قائمة العقارات الخاصة بك" />
      <div
        className="
          mt-10
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings?.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="حذف الملكية"
            currentUser={currentUser}
            imageSrcs={listing.images?.map((image) => image.url) || []}
          />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default PropertiesClient;
