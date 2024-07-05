"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import { SafeListing, SafeUser } from "@/app/types";
import Pagination from "@/app/components/listings/Pagination";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

interface ListingPaginationProps {
  initialListings: SafeListing[];
  initialPage: number;
  totalPages: number;
  currentUser: SafeUser | null;
  searchParams: Record<string, any>;
}

const ListingPagination: React.FC<ListingPaginationProps> = ({
  initialListings,
  initialPage,
  totalPages,
  currentUser,
  searchParams,
}) => {
  const [page, setPage] = useState(initialPage);
  const [listings, setListings] = useState(initialListings);
  const router = useRouter();
  const params = useSearchParams();
  const limit = 20;

  useEffect(() => {
    const fetchListings = async () => {
      const query = qs.stringify({ ...searchParams, page, limit });
      const response = await fetch(`/api/listings?${query}`);
      const data = await response.json();
      setListings(data.listings);
    };

    fetchListings();
  }, [page, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const query = qs.stringify({ ...searchParams, page: newPage });
    router.push(`/?${query}`);
  };

  useEffect(() => {
    const currentPage = params?.get("page");
    if (currentPage) {
      setPage(Number(currentPage));
    }
  }, [params]);

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => {
          const imageSrcs = listing.images.map((image) => image.url);
          return (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              imageSrcs={imageSrcs}
            />
          );
        })}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ListingPagination;
