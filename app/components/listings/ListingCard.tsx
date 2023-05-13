'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useCallback, useMemo} from "react";
import {format} from 'date-fns';
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/react';
import SwiperCore, {Pagination} from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Pagination]);


import useCountries from "@/app/hooks/useCountries";
import {
    SafeListing,
    SafeReservation,
    SafeUser
} from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";
import ViewCounter from "@/app/components/ViewCounter";

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
    imageSrcs?: string[];
    favoritesCount?: number;
    viewCounter?: number;

}


const ListingCard: React.FC<ListingCardProps> = ({
                                                     data,
                                                     reservation,
                                                     onAction,
                                                     disabled,
                                                     actionLabel,
                                                     actionId = '',
                                                     currentUser,
                                                     imageSrcs
                                                 }) => {
    const router = useRouter();
    const {getByValue} = useCountries();

    const location = getByValue(data.locationValue);


    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId)
        }, [disabled, onAction, actionId]);

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    }, [reservation]);

    return (

        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div
                    className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
          "
                >

                    <SwiperComponent
                        pagination={{
                            clickable: true,
                        }}
                        grabCursor={true}
                        className="h-full w-full transition"
                    >
                        {imageSrcs?.map((src, index) => (

                            <SwiperSlide key={index}>
                                <Image
                                    layout="responsive"
                                    className="object-cover h-full w-full"
                                    src={src}
                                    alt={`Listing image ${index + 1}`}
                                    width={50}
                                    height={50}
                                />
                            </SwiperSlide>
                        ))}
                    </SwiperComponent>

                    {/*<div className="font-light text-neutral-500 text-right">*/}
                    {/*    {`Favorites: ${(favoritesCount || 0).toLocaleString()}`}*/}
                    {/*</div>*/}
                    <div className="absolute top-3 right-3 ">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                            favoritesCount={data.favoritesCount}
                        />

                    </div>
                    <div className="absolute bottom-3 left-3">

                        <ViewCounter
                            listingId={data.id}
                            currentUser={currentUser}
                            viewCounter={data.viewCounter}
                        />

                    </div>


                </div>
                <div className="font-semibold text-lg text-right"> {/* Add the 'text-right' class here */}
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500 text-right"> {/* Add the 'text-right' class here */}
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1 justify-end"> {/* Add 'justify-end' class here */}
                    <div className="flex flex-row items-center gap-1 justify-end">
                        {price.toLocaleString('ar-EG')}
                    </div>
                    {!reservation && (
                        <div className="font-light">/ اليوم</div>
                    )}

                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default ListingCard;