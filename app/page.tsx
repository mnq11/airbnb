import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings, { IListingsParams } from "@/app/actions/getListings";
import ListingPagination from "@/app/components/ListingPagination";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: IListingsParams;
}) {
  const page = searchParams.page || 1;
  const limit = 20;

  try {
    const { listings, total } = await getListings({
      ...searchParams,
      page,
      limit,
    });
    const currentUser = await getCurrentUser();

    const totalPages = Math.ceil(total / limit);

    return (
      <ClientOnly>
        <ListingPagination
          initialListings={listings}
          initialPage={page}
          totalPages={totalPages}
          currentUser={currentUser}
          searchParams={searchParams}
        />
      </ClientOnly>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <ClientOnly>
        <EmptyState title="Error" subtitle="Failed to load listings." />
      </ClientOnly>
    );
  }
}
