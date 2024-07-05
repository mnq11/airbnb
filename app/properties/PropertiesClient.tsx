"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SafeListing, SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Pagination from "@/app/components/listings/Pagination";
import EmptyState from "@/app/components/EmptyState";

interface PropertiesClientProps {
  initialListings: SafeListing[];
  initialPage: number;
  totalPages: number;
  currentUser: SafeUser | null;
  searchParams: Record<string, any>;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  initialListings,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [page, setPage] = useState(initialPage);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        userId: currentUser?.id || "",
      }).toString();
      const response = await axios.get(`/api/listings?${queryParams}`);
      setListings(response.data.listings);
    };

    fetchListings();
  }, [page, searchParams, currentUser?.id]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = new URLSearchParams({
      ...searchParams,
      page: newPage.toString(),
      userId: currentUser?.id || "",
    }).toString();
    router.push(`/properties?${query}`);
  };

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

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
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default PropertiesClient;
