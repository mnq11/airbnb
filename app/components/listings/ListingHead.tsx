"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import "swiper/swiper-bundle.min.css";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import ViewCounter from "@/app/components/ViewCounter";
import { TiArrowLeftOutline, TiArrowRightOutline } from "react-icons/ti";
import Loader from "@/app/components/Loader";
import { ShareButton } from "@/components/listing/ShareButton";

SwiperCore.use([Navigation, Thumbs]);

/**
 * Interface for ListingHead component props
 *
 * @interface ListingHeadProps
 * @property {string} title - The title of the property listing
 * @property {string} locationValue - Location code used to look up country/region information
 * @property {Array<{url: string}>} images - Array of image objects containing URLs for the listing
 * @property {string} id - Unique identifier for the listing
 * @property {SafeUser|null} [currentUser] - Currently authenticated user data or null if not logged in
 * @property {number} favoritesCount - Number of users who have favorited this listing
 * @property {number} [viewCounter] - Number of views this listing has received
 * @property {() => void} onView - Callback function to increment view count when component mounts
 */
interface ListingHeadProps {
  title: string;
  locationValue: string;
  images: { url: string }[];
  id: string;
  currentUser?: SafeUser | null;
  favoritesCount: number;
  viewCounter?: number;
  onView: () => void;
}

/**
 * ListingHead Component
 *
 * Displays the header section of a property listing detail page, featuring:
 * - Property title and location
 * - Image gallery with main carousel and thumbnail strip
 * - Favorite button with counter
 * - View counter
 * - Navigation controls for image browsing
 *
 * This component handles image loading states and automatically
 * increments the view counter when mounted.
 *
 * @component
 * @param {ListingHeadProps} props - Component props
 * @returns {JSX.Element} Rendered listing header with image gallery
 */
const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  images,
  id,
  currentUser,
  favoritesCount,
  onView,
  viewCounter,
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles image load completion and removes loading state
   */
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Show loader component when images are loading
  const loader = isLoading ? <Loader /> : null;

  /**
   * Increment view counter when component mounts
   */
  useEffect(() => {
    onView();
  }, [onView]);

  return (
    <div style={{ position: "relative" }}>
      {loader}
      {/* Title and location display */}
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[50vh] overflow-hidden rounded-xl relative">
        {/* Share button positioned at top left */}
        <div className="absolute top-5 left-5 z-10">
          <ShareButton />
        </div>

        {/* Main image carousel */}
        <Swiper
          style={{ height: "80%" }}
          spaceBetween={10}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          thumbs={{ swiper: thumbsSwiper }}
          className="mySwiper2"
        >
          {/* Custom navigation buttons */}
          <div
            className="swiper-button-prev-custom absolute top-3/4 -translate-y-1/2 left-4 z-10 text-white text-2xl font-bold bg-transparent rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md transition duration-300 ease-in-out hover:scale-110"
            style={{ width: "40px", height: "40px", marginTop: "120px" }}
          >
            <TiArrowLeftOutline style={{ marginTop: "-3px" }} />
          </div>
          <div
            className="swiper-button-next-custom absolute top-3/4 -translate-y-1/2 right-4 z-10 text-white text-2xl font-bold bg-transparent rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md transition duration-300 ease-in-out hover:scale-110"
            style={{ width: "40px", height: "40px", marginTop: "120px" }}
          >
            <TiArrowRightOutline style={{ marginTop: "-3px" }} />
          </div>

          {/* Main carousel slides */}
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center"
            >
              <div className="w-full h-full relative">
                <Image
                  src={image.url}
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 lg:h-full lg:w-full lg:object-contain"
                  alt="Image"
                  onLoad={handleImageLoad}
                />
              </div>
              {/* View counter positioned at bottom left */}
              <div className="absolute bottom-3 left-10">
                <ViewCounter
                  listingId={id}
                  currentUser={currentUser}
                  viewCounter={viewCounter}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail strip carousel */}
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true} // updated
          style={{ height: "20%", marginTop: "5px" }}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image.url}
                width={500}
                height={500}
                className="object-cover w-full h-full"
                alt="Thumbnail"
                onLoad={handleImageLoad}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Heart button for favoriting positioned at top right */}
        <div className="absolute top-5 right-7">
          <HeartButton
            listingId={id}
            currentUser={currentUser}
            favoritesCount={favoritesCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingHead;
