import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

import ReservationsClient from "./ReservationsClient";

interface ReservationsPageProps {
  searchParams: {
    page?: number;
    [key: string]: any;
  };
}

const ReservationsPage = async ({ searchParams }: ReservationsPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  const { reservations, total } = await getReservations({
    authorId: currentUser.id,
    page: searchParams.page || 1,
  });
  const totalPages = Math.ceil(total / 20);

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="لم نجد حجوزات"
          subtitle="يبدو أنه ليس لديك أي حجوز على عقاراتك."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        initialReservations={reservations}
        initialPage={searchParams.page || 1}
        totalPages={totalPages}
        currentUser={currentUser}
        searchParams={searchParams}
      />
    </ClientOnly>
  );
};

export default ReservationsPage;
