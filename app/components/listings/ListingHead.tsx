'use client';

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import {SafeUser} from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import {Carousel} from "react-responsive-carousel";

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
images,
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
                <Carousel>
                    { (images || []).map((image, index) => (
                        <div key={index}>
                            <Image src={image.url} fill className="object-cover w-full" alt="Image" />
                        </div>
                    ))}

                </Carousel>
                <div className="absolute top-5 right-5">
                    <HeartButton listingId={id} currentUser={currentUser} />
                </div>
            </div>
        </>
    );
};

export default ListingHead;