'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/app/components/Container';
import ListingCard from '@/app/components/listings/ListingCard';
import EmptyState from '@/app/components/EmptyState';
import { SafeListing, SafeUser } from '@/app/types';
import Pagination from "@/app/components/listings/Pagination";

interface ListingPaginationProps {
    initialListings: SafeListing[];
    initialPage: number;
    totalPages: number;
    currentUser: SafeUser | null;
}

const ListingPagination: React.FC<ListingPaginationProps> = ({ initialListings, initialPage, totalPages, currentUser }) => {
    const [page, setPage] = useState(initialPage);
    const [listings, setListings] = useState(initialListings);
    const limit = 10;

    useEffect(() => {
        const fetchListings = async () => {
            const response = await fetch(`/api/listings?page=${page}&limit=${limit}`);
            const data = await response.json();
            setListings(data.listings);
        };

        fetchListings();
    }, [page]);

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
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Container>
    );
};

export default ListingPagination;
