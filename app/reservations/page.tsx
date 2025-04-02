import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import ReservationsClient from "./ReservationsClient";

/**
 * Interface for ReservationsPage component props
 *
 * @interface ReservationsPageProps
 * @property {Object} searchParams - URL search parameters for pagination and filtering
 * @property {number|string} [searchParams.page=1] - Current page number for pagination
 */
interface ReservationsPageProps {
  searchParams: {
    page?: number | string;
    [key: string]: any;
  };
}

/**
 * ReservationsPage Component
 *
 * Server component that fetches and displays reservations made on the current user's properties.
 * Requires authentication and listing ownership verification.
 *
 * Features:
 * - Server-side data fetching for property reservations
 * - Authentication validation with redirect
 * - Client-side rendering with ClientOnly wrapper
 * - Empty state handling for users with no reservations
 * - Pagination support for large numbers of reservations
 *
 * @component
 * @param {ReservationsPageProps} props - Component props
 * @returns {Promise<JSX.Element>} Rendered reservations page with booking data or empty state
 */
const ReservationsPage = async ({ searchParams }: ReservationsPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="غير مصرح" subtitle="الرجاء تسجيل الدخول" />
      </ClientOnly>
    );
  }

  const { reservations, total } = await getReservations({
    authorId: currentUser.id,
    page:
      typeof searchParams.page === "string"
        ? parseInt(searchParams.page, 10)
        : searchParams.page || 1,
  });

  const totalPages = Math.ceil(total / 10);

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لا يوجد حجوزات"
          subtitle="يبدو أنه لا يوجد حجوزات على عقاراتك."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        initialReservations={reservations}
        initialPage={
          typeof searchParams.page === "string"
            ? parseInt(searchParams.page, 10)
            : searchParams.page || 1
        }
        totalPages={totalPages}
        currentUser={currentUser}
        searchParams={searchParams}
      />
    </ClientOnly>
  );
};

export default ReservationsPage;
