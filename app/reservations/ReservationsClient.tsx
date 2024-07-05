"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";
import EmptyState from "@/app/components/EmptyState";

interface ReservationsClientProps {
  initialReservations: SafeReservation[];
  initialPage: number;
  totalPages: number;
  currentUser?: SafeUser | null;
  searchParams: Record<string, any>;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  initialReservations,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  const router = useRouter();
  const [reservations, setReservations] = useState(initialReservations);
  const [page, setPage] = useState(initialPage);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        authorId: currentUser?.id || "",
      }).toString();
      const response = await axios.get(`/api/reservations?${queryParams}`);
      setReservations(response.data.reservations);
    };

    fetchReservations();
  }, [page, searchParams, currentUser?.id]);

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("تم إلغاء الحجز");
          router.refresh();
        })
        .catch(() => {
          toast.error("هناك خطأ ما.");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = new URLSearchParams({
      ...searchParams,
      page: newPage.toString(),
      authorId: currentUser?.id || "",
    }).toString();
    router.push(`/reservations?${query}`);
  };

  if (reservations.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <Heading title="الحجز" subtitle="الحجوزات على الممتلكات الخاصة بك" />
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
            actionLabel="إلغاء حجز الضيف"
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

export default ReservationsClient;
