import React, { useState, useEffect } from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   page,
                                                   totalPages,
                                                   onPageChange,
                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(page - 1);

    useEffect(() => {
        onPageChange(currentIndex + 1);
    }, [currentIndex, onPageChange]);

    const updateActiveClass = () => {
        document.querySelectorAll("ul li").forEach((btn, index) => {
            if (index === currentIndex) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    };

    useEffect(() => {
        updateActiveClass();
    }, [currentIndex]);

    return (
        <div className="my-8 py-4 flex justify-center items-center space-x-6 bg-gray-100 rounded-full shadow-lg">
            <button
                id="previous"
                onClick={() => setCurrentIndex((currentIndex - 1 + totalPages) % totalPages)}
                disabled={currentIndex === 0}
                className={`px-3 py-2 rounded-full text-white transition transform hover:scale-105 ${
                    currentIndex === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600 shadow"
                }`}
            >
                السابق
            </button>
            <ul className="flex space-x-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <li
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition transform hover:scale-105 ${
                            currentIndex === index
                                ? "bg-rose-500 text-white font-semibold shadow"
                                : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {index + 1}
                    </li>
                ))}
            </ul>
            <button
                id="next"
                onClick={() => setCurrentIndex((currentIndex + 1) % totalPages)}
                disabled={currentIndex === totalPages - 1}
                className={`px-3 py-2 rounded-full text-white transition transform hover:scale-105 ${
                    currentIndex === totalPages - 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600 shadow"
                }`}
            >
                التالي
            </button>
        </div>
    );
};

export default Pagination;
