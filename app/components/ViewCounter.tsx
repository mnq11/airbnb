'use client';

import {SafeUser} from "@/app/types";
import React from "react";
import { BsEye, BsEyeFill } from 'react-icons/bs';

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
        <div className="relative hover:opacity-80 transition cursor-pointer z-10">
            <div className="flex flex-row items-center">
                <div className="font-extrabold text-red-700 mr-9 select-none pointer-events-none">
                    {` ${(viewCounter || 0).toLocaleString('ar-EG')} `}
                </div>
                <BsEye
                    size={28}
                    className={viewCounter ? "text-red-700" : "text-neutral-500/70"}
                />
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
    );
};

    export default ViewCounter;
