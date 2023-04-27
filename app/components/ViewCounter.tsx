import { SafeUser } from "@/app/types";
import React from "react";
import { BsEye } from "react-icons/bs";

interface ViewCounterProps {
    listingId: string;
    currentUser?: SafeUser | null;
    viewCounter?: number;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ viewCounter }) => {
    return (
        <div className="relative hover:opacity-80 transition z-10">
            <div className="flex items-center justify-center bg-white bg-opacity-50 text-gray-900 rounded-md py-0.5 px-1">
                <div className="font-extrabold text-red-700 select-none pointer-events-none">
                    {` ${(viewCounter || 0).toLocaleString("ar-EG")} `}
                </div>
                <div className="flex items-center">
                    <BsEye className={viewCounter ? "text-red-700 ml-1" : "text-neutral-500/70 ml-1"} />
                </div>
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
