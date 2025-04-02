import { SafeListing, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

/**
 * Interface for FavoritesClient component props
 * 
 * @interface FavoritesClientProps
 * @property {SafeListing[]} listings - Array of favorited property listings
 * @property {SafeUser|null} [currentUser] - Current authenticated user data or null if not logged in
 */
interface FavoritesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

/**
 * FavoritesClient Component
 * 
 * Client component that displays a grid of property listings that the user
 * has marked as favorites. This component renders the favorites page content
 * with a responsive grid layout.
 * 
 * Features:
 * - Responsive grid layout that adjusts based on screen size
 * - Display of favorited property listings as cards
 * - Passing user context to listing cards for interaction
 * - Localized heading in Arabic
 * 
 * @component
 * @param {FavoritesClientProps} props - Component props
 * @returns {JSX.Element} Rendered grid of favorited listings
 */
const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
  currentUser,
}) => {
  return (
    <Container>
      <Heading title="المفضلة" subtitle="قائمة الأماكن التي فضلتها" />
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
        {listings.map((listing: SafeListing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
            imageSrcs={
              listing.images ? listing.images.map((image) => image.url) : []
            }
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
