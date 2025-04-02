/**
 * ReservationsClient Component
 * 
 * Client component for displaying and managing property reservations for a host user.
 * Provides functionality to view reservations with pagination and cancel reservations.
 * 
 * Features:
 * - Paginated list of reservation cards
 * - Reservation cancellation with confirmation
 * - Dynamic data fetching for different pages
 * - Responsive grid layout for different screen sizes
 * - Empty state handling when no reservations exist
 * 
 * @component
 */
"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";
import EmptyState from "@/app/components/EmptyState";

/**
 * Props interface for the ReservationsClient component
 * 
 * @interface ReservationsClientProps
 * @property {SafeReservation[]} initialReservations - Initial reservations data from server
 * @property {number} initialPage - Initial page number for pagination
 * @property {number} totalPages - Total number of pages available
 * @property {SafeUser|null} [currentUser] - Currently authenticated user
 * @property {Record<string, any>} searchParams - URL search parameters for filtering
 */
interface ReservationsClientProps {
  initialReservations: SafeReservation[];
  initialPage: number;
  totalPages: number;
  currentUser?: SafeUser | null;
  searchParams: Record<string, any>;
}

/**
 * Client component for displaying and managing property reservations
 * 
 * @param {ReservationsClientProps} props - Component properties
 * @returns {JSX.Element} Rendered reservations page with listing cards and pagination
 */
const ReservationsClient: React.FC<ReservationsClientProps> = ({
  initialReservations,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  const router = useRouter();
  const [reservations, setReservations] = useState(initialReservations);
  const [page, setPage] = useState(initialPage);
  const [deletingId, setDeletingId] = useState("");

  /**
   * Fetches reservations data when page or search parameters change
   */
  useEffect(() => {
    const fetchReservations = async () => {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        authorId: currentUser?.id || "",
      }).toString();
      const response = await axios.get(`/api/reservations?${queryParams}`);
      setReservations(response.data.reservations);
    };

    fetchReservations();
  }, [page, searchParams, currentUser?.id]);

  /**
   * Handles reservation cancellation
   * 
   * @param {string} id - ID of the reservation to cancel
   */
  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("تم إلغاء الحجز");
          router.refresh();
        })
        .catch(() => {
          toast.error("هناك خطأ ما.");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  /**
   * Handles page navigation for pagination
   * 
   * @param {number} newPage - The page number to navigate to
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = new URLSearchParams({
      ...searchParams,
      page: newPage.toString(),
      authorId: currentUser?.id || "",
    }).toString();
    router.push(`/reservations?${query}`);
  };

  if (reservations.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <Heading title="الحجز" subtitle="الحجوزات على الممتلكات الخاصة بك" />
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
        {reservations.map((reservation: SafeReservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="إلغاء حجز الضيف"
            currentUser={currentUser}
            imageSrcs={reservation.listing.images.map((image) => image.url)}
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

export default ReservationsClient;
