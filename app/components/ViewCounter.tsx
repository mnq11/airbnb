'use client';

import {SafeUser} from "@/app/types";
import React from "react";
import {BsEye, BsEyeFill} from "react-icons/all";

interface viewCounterProps {
    listingId: string
    currentUser?: SafeUser | null
    viewCounter?: number
}

const ViewCounter: React.FC<viewCounterProps> = ({
                                                     listingId,
                                                     currentUser,
                                                     viewCounter,
                                                 }) => {


    return (
        <div
            className="relative hover:opacity-80 transition cursor-pointer z-10"
        >
            <div className="flex flex-col items-left">
                <BsEye
                    size={28}
                    className="fill-white absolute -top-[2px] -right-[2px]"
                />
                <BsEyeFill
                    size={24}
                    className={viewCounter ? "fill-rose-500" : "fill-neutral-500/70"}
                />
                {/* Update the viewCounter display */}
                <div className="font-extrabold text-rose-500 text-center mt-1 select-none pointer-events-none">
                    {`${(viewCounter || 0).toLocaleString()}`}
                </div>

                <style jsx>{`
                  .select-none {
                    user-select: none;
                  }

                  .pointer-events-none {
                    pointer-events: none;
                  }
                `}</style>
            </div>
        </div>
    );
};

export default ViewCounter;
