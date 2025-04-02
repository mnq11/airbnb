import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getFavoriteListings from "@/app/actions/getFavoriteListings";

import FavoritesClient from "./FavoritesClient";

/**
 * FavoritesPage Component
 *
 * Server component that fetches and displays a user's favorited property listings.
 * Requires authentication - redirects to empty state if user is not logged in.
 *
 * Features:
 * - Server-side data fetching for favorite listings
 * - Authentication state validation
 * - Client-side rendering with ClientOnly wrapper
 * - Empty state display when no favorites exist
 *
 * @component
 * @returns {Promise<JSX.Element>} Rendered favorites page with user's saved listings
 */
export default async function FavoritesPage() {
  const currentUser = await getCurrentUser();
  const favorites = await getFavoriteListings();

  if (favorites.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لا توجد مفضلات"
          subtitle="يبدو أنه ليس لديك أي مفضلات حتى الان."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient listings={favorites} currentUser={currentUser} />
    </ClientOnly>
  );
}
