import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";
import PropertiesClient from "./PropertiesClient";
import { SafeListing } from "@/app/types";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  // Adjust here to destructure the response from getListings
  const { listings } = await getListings({ userId: currentUser.id });

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
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default PropertiesPage;
