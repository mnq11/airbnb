'use client';
import React, { useEffect, useState } from 'react';
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import getListings, { IListingsParams } from "@/app/actions/getListings";
import Pagination from "@/app/components/Pagination";
import {Listing} from "@prisma/client";
import useSWR from "swr";
import fetcher from "@/app/libs/fetcher";
type SafeListing = Omit<Listing, 'createdAt'> & { createdAt: string };

interface HomeWithPaginationProps {
    searchParams: IListingsParams;
}

function listingsParamsToQueryString(params: IListingsParams = {}): string {
    return Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
}


interface HomeWithPaginationProps {
    initialSearchParams: IListingsParams;
}


const HomeWithPagination: React.FC<HomeWithPaginationProps> = ({ initialSearchParams }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState<IListingsParams>(initialSearchParams);
    const [apiUrl, setApiUrl] = useState<string>(`/api/listings?${listingsParamsToQueryString(searchParams)}`);
    const { data: responseData, error } = useSWR<{ listings: SafeListing[], totalPages: number }>(apiUrl, fetcher);
    const listings = responseData?.listings;

    useEffect(() => {
        setApiUrl(`/api/listings?${listingsParamsToQueryString(searchParams)}`);
    }, [searchParams]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setSearchParams({ ...searchParams, page });
    };
    useEffect(() => {
        if (responseData) {
            setTotalPages(responseData.totalPages);
            console.log("API Response:", responseData);

        }
    }, [responseData]);

    return (
        <>
            {(listings || []).length > 0 ? (
                <>
                    <Container>
                        <div
                            className="
        pt-24
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
                            {(listings || []).map((listing: any) => {
                                const imageSrcs = listing.images.map((image: any) => image.url);

                                return (
                                    <ListingCard
                                        key={listing.id}
                                        data={listing}
                                        imageSrcs={imageSrcs}
                                    />
                                );
                            })}
                        </div>
                    </Container>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                </>
            ) : (
                <EmptyState showReset />
            )}
        </>
    );

};

export default HomeWithPagination;
