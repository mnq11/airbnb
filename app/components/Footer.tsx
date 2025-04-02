// File: components/Footer.tsx
"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

/**
 * Footer Component
 * 
 * A responsive footer that appears at the bottom of every page in the application.
 * Includes social media links, app download button, and copyright information.
 * 
 * Features:
 * - Gradient background with animation effects
 * - Social media links with hover effects
 * - App download call-to-action button
 * - Copyright information
 * - Fully responsive design
 * 
 * The component uses React Icons for social media icons and
 * custom animation classes for smooth appearance effects.
 * 
 * @component
 * @returns {JSX.Element} Rendered footer with social links and copyright
 */
const Footer = () => (
    <footer className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12 text-center flex flex-col items-center justify-center rounded-lg shadow-lg mt-auto animate-fadeIn">
        {/* Social media links with hover effects */}
        <div className="flex space-x-4 mb-6 relative z-10 animate-fadeInDelay3">
            <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
                aria-label="Visit our Facebook page"
            >
                <FaFacebook size={24} />
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
                aria-label="Visit our Twitter profile"
            >
                <FaTwitter size={24} />
            </a>
            <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-200 transform hover:scale-110 transition duration-300"
                aria-label="Visit our Instagram page"
            >
                <FaInstagram size={24} />
            </a>
        </div>
        
        {/* App download button */}
        <a
            href="#download"
            className="bg-white text-pink-500 py-2 px-6 rounded-full font-bold transition transform hover:scale-105 hover:bg-pink-200 relative z-10 animate-fadeInDelay4"
            aria-label="Download our mobile app"
        >
            تحميل التطبيق
        </a>
        
        {/* Copyright information */}
        <p className="mb-2 text-lg font-semibold relative z-10 animate-fadeInDelay">
            © 2024 جولتنا. جميع الحقوق محفوظة.
        </p>
        <p className="mb-6 text-sm md:text-base relative z-10 animate-fadeInDelay2">
            تطبيقنا سيكون متاحًا قريبًا في السوق
        </p>
    </footer>
);

export default Footer;
