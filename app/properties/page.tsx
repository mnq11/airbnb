import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";
import PropertiesClient from "@/app/properties/PropertiesClient";

interface PropertiesPageProps {
  searchParams: {
    page?: number;
    [key: string]: any;
  };
}

const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const { listings, total } = await getListings({
    userId: currentUser.id,
    page: searchParams.page || 1,
  });
  const totalPages = Math.ceil(total / 10);

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لا يوجد عقارات"
          subtitle="يبدو أنك لم تقم بإضافة أي عقارات"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient
        initialListings={listings}
        initialPage={searchParams.page || 1}
        totalPages={totalPages}
        currentUser={currentUser}
        searchParams={searchParams}
      />
    </ClientOnly>
  );
};

export default PropertiesPage;
