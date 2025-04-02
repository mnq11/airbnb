"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/swiper.min.css";

// Initialize Swiper with Pagination module
SwiperCore.use([Pagination]);

//app/components/listings/ListingCard.tsx
import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";
import ViewCounter from "@/app/components/ViewCounter";

/**
 * Interface for ListingCard component props
 *
 * @interface ListingCardProps
 * @property {SafeListing} data - Property listing data from the database (serialized for client)
 * @property {SafeReservation} [reservation] - Reservation data if this card displays a booking
 * @property {(id: string) => void} [onAction] - Callback function for card action (e.g., cancel reservation)
 * @property {boolean} [disabled] - Disables action button when true
 * @property {string} [actionLabel] - Label for the action button (e.g., "Cancel reservation")
 * @property {string} [actionId] - ID passed to onAction callback (defaults to empty string)
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 * @property {string[]} [imageSrcs] - Array of image URLs for the property listing
 * @property {number} [favoritesCount] - Number of users who have favorited this listing
 * @property {number} [viewCounter] - Number of views this listing has received
 */
interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  imageSrcs?: string[];
  favoritesCount?: number;
  viewCounter?: number;
}

/**
 * ListingCard Component
 *
 * A responsive property listing card component used throughout the application to display
 * property information in a consistent and visually appealing format. This component appears on:
 * - Search results pages
 * - Favorites pages
 * - Reservations/trips pages
 * - User property listings
 *
 * Features:
 * - Image carousel with pagination using Swiper
 * - Favorite button with counter
 * - View counter
 * - Location information with country/region lookup
 * - Price display with localization
 * - Reservation date display (when applicable)
 * - Optional action button (e.g., for cancellation)
 * - RTL text alignment for Arabic language support
 *
 * @component
 * @param {ListingCardProps} props - Component props
 * @returns {JSX.Element} Rendered listing card with images and property details
 */
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  imageSrcs,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  // Get location data from country/region code
  const location = getByValue(data.locationValue);

  /**
   * Handles action button click (e.g., cancel reservation)
   * Stops propagation to prevent card navigation when clicking the button
   */
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId],
  );

  /**
   * Calculates the price to display:
   * - Shows reservation total price when displaying a reservation
   * - Shows per-night price when displaying a property listing
   */
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  /**
   * Formats reservation date range for display
   * Returns null if not displaying a reservation
   */
  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        {/* Image carousel with favorite and view counter */}
        <div
          className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
          "
        >
          {/* Swiper image carousel */}
          <SwiperComponent
            pagination={{
              clickable: true,
            }}
            grabCursor={true}
            className="h-full w-full transition"
          >
            {imageSrcs?.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  layout="responsive"
                  className="object-cover h-full w-full"
                  src={src}
                  alt={`Listing image ${index + 1}`}
                  width={100}
                  height={100}
                />
              </SwiperSlide>
            ))}
          </SwiperComponent>

          {/* Favorite button in top-right corner */}
          <div className="absolute top-3 right-3 ">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
              favoritesCount={data.favoritesCount}
            />
          </div>

          {/* View counter in bottom-left corner */}
          <div className="absolute bottom-3 left-3">
            <ViewCounter
              listingId={data.id}
              currentUser={currentUser}
              viewCounter={data.viewCounter}
            />
          </div>
        </div>

        {/* Location information (right-aligned for RTL) */}
        <div className="font-semibold text-lg text-right">
          {location?.region}, {location?.label}
        </div>

        {/* Category or reservation date (right-aligned for RTL) */}
        <div className="font-light text-neutral-500 text-right">
          {reservationDate || data.category}
        </div>

        {/* Price display with currency formatting (right-aligned for RTL) */}
        <div className="flex flex-row items-center gap-1 justify-end">
          <div className="flex flex-row items-center gap-1 justify-end">
            {price.toLocaleString("ar-EG")}
          </div>
          {!reservation && <div className="font-light">/ اليوم</div>}
        </div>

        {/* Optional action button (e.g., cancel reservation) */}
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
