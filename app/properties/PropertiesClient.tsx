"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeListing, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("حذفت العقار بنجاح");
            router.refresh();
          } else {
            toast.error(`Error: ${response.status}`);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "An error occurred");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router],
  );

  return (
    <Container>
      <Heading title="العقارات" subtitle="قائمة العقارات الخاصة بك" />
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
        {listings?.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="حذف الملكية"
            currentUser={currentUser}
            imageSrcs={listing.images?.map((image) => image.url) || []}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
