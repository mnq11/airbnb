'use client';

import Image from "next/image";
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import useCountries from "@/app/hooks/useCountries";
import {SafeUser} from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";

SwiperCore.use([Navigation, Pagination]);

interface ListingHeadProps {
    title: string;
    locationValue: string;
    images: { url: string }[];
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
                                                     title,
                                                     locationValue,
                                                     images = [], // Provide a default value for the images prop
                                                     id,
                                                     currentUser,
                                                 }) => {
    const {getByValue} = useCountries();

    const location = getByValue(locationValue);

    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <SwiperComponent
                    navigation
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={image.url}
                                layout="responsive"
                                width={1200}
                                height={800}
                                className="object-cover w-full"
                                alt="Image"
                            />
                        </SwiperSlide>
                    ))}
                </SwiperComponent>
                <div className="absolute top-5 right-5">
                    <HeartButton listingId={id} currentUser={currentUser} />
                </div>
            </div>
        </>
    );
};

export default ListingHead;
