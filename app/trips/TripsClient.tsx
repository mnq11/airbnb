// File: /app/trips/TripsClient.tsx

"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";

interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
  totalPages: number;
  initialPage: number;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations: initialReservations,
  currentUser,
  totalPages,
  initialPage,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [reservations, setReservations] = useState(initialReservations);
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("تم إلغاء الحجز بنجاح");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const response = await axios.get(
      `/api/reservations?page=${newPage}&userId=${currentUser?.id}`,
    );
    setReservations(response.data.reservations);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get(
        `/api/reservations?page=${page}&userId=${currentUser?.id}`,
      );
      setReservations(response.data.reservations);
    };

    fetchReservations();
  }, [page, currentUser?.id]);

  return (
    <Container>
      <div dir="rtl" className="text-right">
        <Heading title="رحلات" subtitle="أين كنت وأين تذهب" />
      </div>
      <div
        className="
          mt-10
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations.map((reservation: SafeReservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="إلغاء الحجز"
            currentUser={currentUser}
            imageSrcs={reservation.listing.images.map((image) => image.url)}
          />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default TripsClient;
