'use client';
import axios from 'axios';
import useCountries from "@/app/hooks/useCountries";
import {SafeUser} from "@/app/types";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Thumbs} from 'swiper/core';

import 'swiper/swiper-bundle.min.css';
import React, {useState,useEffect} from "react";
import {Listing} from "@prisma/client";
import Image from 'next/image';


SwiperCore.use([Navigation, Thumbs]);

interface ListingHeadProps {
    title: string;
    locationValue: string;
    images: { url: string }[];
    id: string;
    currentUser?: SafeUser | null;
    favoritesCount: number;
    viewCounter?: number;
    onView: () => void; // Add this line

}

const ListingHead: React.FC<ListingHeadProps> = ({
                                                     title,
                                                     locationValue,
                                                     images,
                                                     id,
                                                     currentUser,
                                                     favoritesCount,
                                                     viewCounter,
                                                     onView, // Add this line

                                                 }) => {


    const {getByValue} = useCountries();
    const location = getByValue(locationValue);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);


    useEffect(() => {
        onView(); // Call the incrementViewCounter function when the component is mounted
    }, [onView]);
    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <Swiper
                    style={{height: '80%'}}
                    spaceBetween={10}
                    navigation
                    thumbs={{swiper: thumbsSwiper}}
                    className="mySwiper2"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image src={image.url} className="object-cover w-full h-full" alt="Image"/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode
                    watchSlidesVisibility
                    watchSlidesProgress
                    style={{height: '20%', marginTop: '5px'}}
                    className="mySwiper"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image src={image.url} className="object-cover w-full h-full" alt="Thumbnail"/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                        favoritesCount={favoritesCount}
                    />
                </div>
            </div>
        </>
    );
};


export default ListingHead;
