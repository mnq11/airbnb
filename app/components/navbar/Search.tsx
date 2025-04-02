/**
 * Search Component
 * 
 * Client component that displays a search bar in the navigation area, allowing users
 * to search for properties with filters for location, dates, and guest count.
 * 
 * Features:
 * - Interactive search button that opens the search modal
 * - Displays current search parameters from URL
 * - Responsive design that adjusts display based on screen size
 * - Localized to Arabic
 * 
 * @component
 * @returns {JSX.Element} Rendered search bar with current search parameters
 */
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { differenceInDays } from "date-fns";

import useSearchModal from "@/app/hooks/useSearchModal";
import useCountries from "@/app/hooks/useCountries";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const guestCount = params?.get("guestCount");

  /**
   * Formats location display based on URL parameters
   * Returns location label or default "أي مكان" text
   */
  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return "أي مكان";
  }, [locationValue, getByValue]);

  /**
   * Calculates and formats trip duration based on start and end dates
   * Handles Arabic pluralization rules for days
   */
  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);
      let label = "أيام";
      if (diff === 0) {
        diff = 1;
      }
      if (diff == 1) {
        label = "يوم";
      }
      if (diff == 2) {
        label = "يومين";
      } else if (diff > 2) {
        label = "أيام";
      }

      return `${diff} ${label} `;
    }

    return "اي اسبوع";
  }, [startDate, endDate]);

  /**
   * Formats guest count display based on URL parameters
   */
  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} ضيف`;
    }

    return "ابحث عن مكان بعدد الضيوف المناسب";
  }, [guestCount]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="
        border-[1px] 
        w-full 
        md:w-auto 
        py-2 
        rounded-full 
        shadow-sm 
        hover:shadow-md 
        transition 
        cursor-pointer
      "
    >
      <div
        className="
          flex 
          flex-row 
          items-center 
          justify-between
        "
      >
        <div
          className="
            text-sm 
            font-semibold 
            px-6
          "
        >
          {locationLabel}
        </div>
        <div
          className="
            hidden 
            sm:block 
            text-sm 
            font-semibold 
            px-6 
            border-x-[1px] 
            flex-1 
            text-center
          "
        >
          {durationLabel}
        </div>
        <div
          className="
            text-sm 
            pl-6 
            pr-2 
            text-gray-600 
            flex 
            flex-row 
            items-center 
            gap-3
          "
        >
          <div className="hidden sm:block">{guestLabel}</div>
          <div
            className="
              p-2 
              bg-rose-500 
              rounded-full 
              text-white
            "
          >
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
