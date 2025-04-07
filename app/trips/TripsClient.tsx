// File: /app/trips/TripsClient.tsx

"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";
import TripCalendarView from "./TripCalendarView";
import ViewToggle from "./ViewToggle";

/**
 * Interface for TripsClient component props
 *
 * @interface TripsClientProps
 * @property {SafeReservation[]} reservations - Array of reservation data for trips booked by the user
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 * @property {number} totalPages - Total number of pages available for pagination
 * @property {number} initialPage - Starting page number for pagination
 */
interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
  totalPages: number;
  initialPage: number;
}

/**
 * TripsClient Component
 *
 * Client component that displays a user's booked trips with pagination and cancellation functionality.
 * This component renders the trips page content with a responsive grid layout and
 * handles reservation cancellation and page navigation.
 *
 * Features:
 * - Responsive grid layout for trip cards
 * - Reservation cancellation with loading state
 * - Pagination with server-side data fetching
 * - Arabic localization for headings and actions
 * - Displays detailed trip information via ListingCard components
 * - Calendar view with color-coded reservations by property
 * - Toggle between list and calendar views
 *
 * @component
 * @param {TripsClientProps} props - Component props
 * @returns {JSX.Element} Rendered grid of trip bookings with pagination
 */
const TripsClient: React.FC<TripsClientProps> = ({
  reservations: initialReservations,
  currentUser,
  totalPages,
  initialPage,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [reservations, setReservations] = useState(initialReservations);
  const [deletingId, setDeletingId] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

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
          toast.success("تم إلغاء الحجز بنجاح");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  /**
   * Handles page change in pagination
   * Fetches new reservation data for the selected page
   *
   * @param {number} newPage - New page number to display
   */
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const response = await axios.get(
      `/api/reservations?page=${newPage}&userId=${currentUser?.id}`,
    );
    setReservations(response.data.reservations);
  };

  /**
   * Fetch reservations when page or user changes
   */
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get(
        `/api/reservations?page=${page}&userId=${currentUser?.id}`,
      );
      setReservations(response.data.reservations);
    };

    fetchReservations();
  }, [page, currentUser?.id]);

  /**
   * Handles view mode change
   * @param {('list'|'calendar')} mode - The view mode to change to
   */
  const handleViewChange = (mode: 'list' | 'calendar') => {
    setViewMode(mode);
  };

  return (
    <Container>
      <div dir="rtl" className="text-right">
        <Heading title="رحلات" subtitle="أين كنت وأين تذهب" />
        
        {reservations.length > 0 && (
          <ViewToggle view={viewMode} onChange={handleViewChange} />
        )}
      </div>

      {viewMode === 'list' ? (
        <div
          className="
            mt-6
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
              actionLabel="إلغاء الحجز"
              currentUser={currentUser}
              imageSrcs={reservation.listing.images.map((image) => image.url)}
            />
          ))}
        </div>
      ) : (
        <TripCalendarView reservations={reservations} />
      )}

      {viewMode === 'list' && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default TripsClient;
