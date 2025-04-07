import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

/**
 * Interface defining the properties passed to the ListingPage component
 *
 * @interface IParams
 * @property {string} listingId - The unique identifier of the listing to display
 */
interface IParams {
  listingId: string;
}

/**
 * ListingPage Component
 *
 * Server component that fetches and displays detailed information about a specific property listing.
 * Handles data fetching for listing details, reservations, and current user authentication.
 *
 * Features:
 * - Dynamic routing with listingId parameter
 * - Server-side data fetching for listing and reservation data
 * - Error handling for non-existent listings
 * - Client-side rendering with ClientOnly wrapper
 *
 * @component
 * @param {Object} props - Component props
 * @param {IParams} props.params - Route parameters containing the listingId
 * @returns {Promise<JSX.Element>} Rendered listing detail page or empty state if listing not found
 */
const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations({ listingId: params.listingId });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservations?.reservations ?? []}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
