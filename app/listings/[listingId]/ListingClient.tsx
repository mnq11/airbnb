/**
 * ListingClient Component
 *
 * Client component that renders a detailed view of a property listing, including
 * images, information, pricing, and reservation functionality. Handles view counting,
 * reservation creation, and date selection.
 *
 * Features:
 * - Interactive date range selection for reservations
 * - Dynamic price calculation based on selected dates
 * - Reservation submission with authentication check
 * - View counter tracking
 * - Responsive layout with grid structure
 * - Automatic view increment on component render
 *
 * @component
 */

"use client";

import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from "date-fns";
import { motion } from 'framer-motion';
import L, { LatLngTuple } from "leaflet";

import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";

/**
 * Initial date range for reservation calendar
 * Sets both start and end dates to the current date
 */
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

/**
 * Props interface for the ListingClient component
 *
 * @interface ListingClientProps
 * @property {SafeReservation[]} [reservations] - Array of existing reservations for the listing
 * @property {SafeListing & {user: SafeUser | null}} listing - The listing data with its owner
 * @property {SafeUser | null} [currentUser] - The currently authenticated user if any
 */
interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser | null;
  };
  currentUser?: SafeUser | null;
}

/**
 * Client component for displaying detailed listing information and reservation functionality
 *
 * @param {ListingClientProps} props - Component properties
 * @returns {JSX.Element} Rendered listing detail page with reservation form
 */
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const { getByValue } = useCountries();

  /**
   * Calculates dates that are already reserved and should be disabled in the calendar
   */
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    if (Array.isArray(reservations)) {
      reservations.forEach((reservation: SafeReservation) => {
        const range = eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate),
        });

        dates = [...dates, ...range];
      });
    }

    return dates;
  }, [reservations]);

  /**
   * Finds the category object matching the listing's category
   */
  const category = useMemo(() => {
    return categories.find((items) => items.label === listing.category);
  }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  /**
   * Determine the coordinates for the map
   */
  const mapCoordinates: LatLngTuple | undefined = useMemo(() => {
    // 1. Prioritize explicitly saved latitude/longitude
    if (listing.latitude != null && listing.longitude != null) {
      return [listing.latitude, listing.longitude];
    }
    
    // 2. Fallback: Try parsing coordinates from locationValue (format "lat,lng")
    if (listing.locationValue && listing.locationValue.includes(',')) {
      const parts = listing.locationValue.split(',');
      if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng]; // Return as LatLngTuple
          }
      }
    }
    
    // 3. Fallback: Get coordinates from the country data based on locationValue
    const countryData = getByValue(listing.locationValue);
    // Ensure countryData.latlng is a valid tuple [number, number]
    if (countryData?.latlng && countryData.latlng.length === 2) {
        return [countryData.latlng[0], countryData.latlng[1]]; // Return as LatLngTuple
    }
    
    // If no valid coordinates found, return undefined
    return undefined;
  }, [listing.latitude, listing.longitude, listing.locationValue, getByValue]);

  /**
   * Handles reservation creation
   * Checks authentication, validates owner status, and submits reservation data
   */
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    if (currentUser.id !== listing.user?.id) {
      toast.error(
        " حتى نتمكن من تأكيد الحجز: تواصل مع المستضيف معلوماتة ستجدها في صندوق الوصف ",
        {
          className: "rtl-toast-container",
        },
      );
      return;
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("تم الحجز");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => {
        toast.error("حدث خطأ ما");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    totalPrice,
    listing.id,
    router,
    currentUser,
    loginModal,
    listing.user?.id,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  /**
   * Calculates total price based on selected date range
   * Updates whenever date range or listing price changes
   */
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  /**
   * Increments the view counter for this listing
   * Called when the component renders
   */
  const onView = useCallback(async () => {
    try {
      await axios.post(`/api/views/${listing.id}`);
    } catch (error) {
      console.error("Failed to increment view counter:", error);
    }
  }, [listing.id]);

  return (
    <Container>
      <motion.div
        className="max-w-screen-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            images={listing.images}
            locationValue={mapCoordinates ? `${mapCoordinates[0].toFixed(4)}, ${mapCoordinates[1].toFixed(4)}` : listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
            favoritesCount={listing.favoritesCount}
            onView={onView}
            viewCounter={listing.viewCounter}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              coordinates={mapCoordinates}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default ListingClient;
