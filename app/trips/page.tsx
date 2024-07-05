// File: /app/trips/page.tsx

import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import TripsClient from "./TripsClient";

interface TripsPageProps {
    searchParams: {
        page?: number;
        [key: string]: any;
    };
}

const TripsPage = async ({ searchParams }: TripsPageProps) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login" />
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
                    title="لا يوجد رحلات محجوزة "
                    subtitle="يبدو انه لا توجد رحلات محجوزة"
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
