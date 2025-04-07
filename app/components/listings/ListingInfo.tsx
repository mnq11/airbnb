import React from "react";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import { IoMdPerson, IoMdBed, IoMdWater } from "react-icons/io"; // Import the icons

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import { LatLngTuple } from "leaflet";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

/**
 * Interface for ListingInfo component props
 *
 * @interface ListingInfoProps
 * @property {SafeUser|null} user - Property owner/host user data
 * @property {string} description - Detailed description of the property
 * @property {number} guestCount - Maximum number of guests allowed
 * @property {number} roomCount - Number of rooms in the property
 * @property {number} bathroomCount - Number of bathrooms in the property
 * @property {Object} [category] - Category information for the property
 * @property {IconType} category.icon - Icon component representing the category
 * @property {string} category.label - Category name
 * @property {string} category.description - Detailed description of the category
 * @property {string} locationValue - Location identifier for country/region lookup
 */
interface ListingInfoProps {
  user: SafeUser | null;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
}

/**
 * ListingInfo Component
 *
 * Displays detailed information about a property listing, including:
 * - Host information with avatar
 * - Property details (guest capacity, room count, bathrooms)
 * - Category information with description
 * - Full property description
 * - Location map
 *
 * This component is used within the ListingClient to show the main
 * property details section alongside the reservation panel.
 *
 * Features:
 * - Responsive grid layout that adjusts for mobile/desktop
 * - Dynamic map loading with location marker
 * - Arabic number formatting
 * - Structured property information with icons
 * - Host information display
 *
 * @component
 * @param {ListingInfoProps} props - Component props
 * @returns {JSX.Element} Rendered property information section
 */
const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;

  // Helper function for number formatting
  const formatNumberAr = (num: number) => num.toLocaleString("ar-EG");

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center justify-end gap-2 text-right">
          <span>المستضيف {user?.name}</span>
          <Avatar src={user?.image} />
        </div>
      </div>

      <div className="flex flex-row items-center gap-6 font-light text-neutral-700 justify-end text-right">
        <div className="flex flex-row items-center gap-2">
          <span>{formatNumberAr(guestCount)} ضيوف</span>
          <IoMdPerson size={20} className="text-neutral-500" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <span>{formatNumberAr(roomCount)} غرف</span>
          <IoMdBed size={20} className="text-neutral-500" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <span>{formatNumberAr(bathroomCount)} حمامات</span>
          <IoMdWater size={20} className="text-neutral-500" />
        </div>
      </div>

      <hr />

      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description}
        />
      )}

      <hr />

      <div className="text-lg font-light text-neutral-600 whitespace-pre-line text-right leading-relaxed">
        {description}
      </div>

      <hr />

      <div className="h-[35vh] rounded-lg overflow-hidden">
        <Map center={coordinates as LatLngTuple | undefined} />
      </div>
    </div>
  );
};

export default ListingInfo;
