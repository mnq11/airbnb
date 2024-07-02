import React from 'react';
import Container from '@/app/components/Container';
import ListingCard from '@/app/components/listings/ListingCard';
import EmptyState from '@/app/components/EmptyState';
import ClientOnly from './components/ClientOnly';
import getListings, { IListingsParams } from '@/app/actions/getListings';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { SafeListing } from '@/app/types';

interface HomeProps {
    searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
    try {
        const listings: SafeListing[] = await getListings(searchParams);
        const currentUser = await getCurrentUser();

        if (listings.length === 0) {
            return (
                <ClientOnly>
                    <EmptyState showReset />
                </ClientOnly>
            );
        }

        return (
            <ClientOnly>
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
                </Container>
            </ClientOnly>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return (
            <ClientOnly>
                <EmptyState title="Error" subtitle="Failed to load listings." />
            </ClientOnly>
        );
    }
};

export default Home;
