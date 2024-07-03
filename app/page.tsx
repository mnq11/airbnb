import React from 'react';
import getListings, { IListingsParams } from '@/app/actions/getListings';
import getCurrentUser from '@/app/actions/getCurrentUser';
import ListingPagination from '@/app/components/ListingPagination';
import ClientOnly from './components/ClientOnly';
import EmptyState from "@/app/components/EmptyState";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: IListingsParams }) {
    const page = 1;
    const limit = 10;

    try {
        const { listings, total } = await getListings({ ...searchParams, page, limit });
        const currentUser = await getCurrentUser();

        const totalPages = Math.ceil(total / limit);

        return (
            <ListingPagination
                initialListings={listings}
                initialPage={page}
                totalPages={totalPages}
                currentUser={currentUser}
            />
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return (
            <ClientOnly>
                <EmptyState title="Error" subtitle="Failed to load listings." />
            </ClientOnly>
        );
    }
}
