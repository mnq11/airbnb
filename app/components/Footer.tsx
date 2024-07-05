// File: components/Footer.tsx
"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => (
    <footer className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12 text-center flex flex-col items-center justify-center rounded-lg shadow-lg mt-auto animate-fadeIn">
        <div className="flex space-x-4 mb-6 relative z-10 animate-fadeInDelay3">
            <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
            >
                <FaFacebook size={24} />
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
            >
                <FaTwitter size={24} />
            </a>
            <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
            >
                <FaInstagram size={24} />
            </a>
        </div>
        <a
            href="#download"
            className="bg-white text-pink-500 py-2 px-6 rounded-full font-bold transition transform hover:scale-105 hover:bg-pink-200 relative z-10 animate-fadeInDelay4"
        >
            تحميل التطبيق
        </a>
        <p className="mb-2 text-lg font-semibold relative z-10 animate-fadeInDelay">
            © 2024 جولتنا. جميع الحقوق محفوظة.
        </p>
        <p className="mb-6 text-sm md:text-base relative z-10 animate-fadeInDelay2">
            تطبيقنا سيكون متاحًا قريبًا في السوق
        </p>
    </footer>
);

export default Footer;
