import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";
import PropertiesClient from "@/app/properties/PropertiesClient";

/**
 * Interface for PropertiesPage component props
 *
 * @interface PropertiesPageProps
 * @property {Object} searchParams - URL search parameters for pagination and filtering
 * @property {number|string} [searchParams.page=1] - Current page number for pagination
 */
interface PropertiesPageProps {
  searchParams: {
    page?: number | string;
    [key: string]: any;
  };
}

/**
 * PropertiesPage Component
 *
 * Server component that fetches and displays properties owned by the current user.
 * Requires authentication - redirects to login page if user is not logged in.
 *
 * Features:
 * - Server-side data fetching for user's property listings
 * - Authentication validation with redirect
 * - Client-side rendering with ClientOnly wrapper
 * - Empty state handling for users with no properties
 * - Pagination support for large property portfolios
 *
 * @component
 * @param {PropertiesPageProps} props - Component props
 * @returns {Promise<JSX.Element>} Rendered properties page with user's listings or empty state
 */
const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="غير مصرح" subtitle="الرجاء تسجيل الدخول" />
      </ClientOnly>
    );
  }

  const { listings, total } = await getListings({
    userId: currentUser.id,
    page:
      typeof searchParams.page === "string"
        ? parseInt(searchParams.page, 10)
        : searchParams.page || 1,
  });

  const totalPages = Math.ceil(total / 10);

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لا يوجد عقارات"
          subtitle="يبدو أنه ليس لديك أي عقارات."
          showReset
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient
        initialListings={listings}
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

export default PropertiesPage;
