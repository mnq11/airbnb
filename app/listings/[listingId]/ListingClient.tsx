'use client';
// ListingClient.tsx
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Range } from 'react-date-range';
import { useRouter } from 'next/navigation';
import { differenceInDays, eachDayOfInterval } from 'date-fns';

import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

import Container from '@/app/components/Container';
import { categories } from '@/app/components/navbar/Categories';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser | null;
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
                                                         listing,
                                                         reservations = [],
                                                         currentUser,
                                                     }) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation: SafeReservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [reservations]);

    const category = useMemo(() => {
        return categories.find((items) => items.label === listing.category);
    }, [listing.category]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        if (currentUser.id !== listing.user?.id) {
            toast.error(' حتى نتمكن من تأكيد الحجز: تواصل مع المستضيف معلوماتة ستجدها في صندوق الوصف ', {
                className: 'rtl-toast-container',
            });
            return;
        }

        setIsLoading(true);

        axios
            .post('/api/reservations', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing?.id,
            })
            .then(() => {
                toast.success('تم الحجز');
                setDateRange(initialDateRange);
                router.push('/trips');
            })
            .catch(() => {
                toast.error('حدث خطأ ما');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        totalPrice,
        listing.id,
        router,
        currentUser,
        loginModal,
        listing.user?.id,
        dateRange.startDate,
        dateRange.endDate,
    ]);

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    const onView = useCallback(async () => {
        try {
            await axios.post(`/api/views/${listing.id}`);
        } catch (error) {
            console.error('Failed to increment view counter:', error);
        }
    }, [listing.id]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        images={listing.images}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                        favoritesCount={listing.favoritesCount}
                        onView={onView}
                        viewCounter={listing.viewCounter}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;
