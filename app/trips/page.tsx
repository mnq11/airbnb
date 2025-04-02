// File: /app/trips/page.tsx

import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import TripsClient from "./TripsClient";

/**
 * Interface for TripsPage component props
 *
 * @interface TripsPageProps
 * @property {Object} searchParams - URL search parameters
 * @property {number} [searchParams.page] - Current page number for pagination
 * @property {any} [searchParams[key]] - Any other search parameters
 */
interface TripsPageProps {
  searchParams: {
    page?: number;
    [key: string]: any;
  };
}

/**
 * TripsPage Component
 *
 * Server component that fetches and displays a user's booking history (trips).
 * Requires authentication - redirects to login page if user is not logged in.
 *
 * Features:
 * - Server-side data fetching for trip reservations
 * - Authentication validation with redirect
 * - Client-side rendering with ClientOnly wrapper
 * - Empty state handling for users with no trips
 *
 * @component
 * @returns {Promise<JSX.Element>} Rendered trips page with booking history or empty state
 */
const TripsPage = async ({ searchParams }: TripsPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="غير مصرح" subtitle="الرجاء تسجيل الدخول" />
      </ClientOnly>
    );
  }

  const { reservations, total } = await getReservations({
    userId: currentUser.id,
    page: searchParams.page || 1,
  });

  const totalPages = Math.ceil(total / 10);

  if (!reservations || reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لا يوجد رحلات"
          subtitle="يبدو أنك لم تحجز أي رحلات بعد"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <TripsClient
        reservations={reservations}
        currentUser={currentUser}
        totalPages={totalPages}
        initialPage={searchParams.page || 1}
      />
    </ClientOnly>
  );
};

export default TripsPage;
