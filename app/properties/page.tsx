
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";

import PropertiesClient from "./PropertiesClient";
import { images } from 'next/dist/build/webpack/config/blocks/images';

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState title="Unauthorized" subtitle="Please login" />
    );
  }

  const listings = await getListings({ userId: currentUser.id });

  // Add images property to each listing object
  const safeListings = listings.map((listing) => ({
    ...listing,
    images: images.images || [], // Add this line
  }));

  if (safeListings.length === 0) {
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
        listings={safeListings}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default PropertiesPage;
