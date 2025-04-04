'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons

export function ShareButton() {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Construct the full URL - ensure NEXT_PUBLIC_BASE_URL is set in your .env
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const fullUrl = `${baseUrl}${pathname}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title, // Or a more specific title
                    text: 'Check out this listing!', // Or a more specific text
                    url: fullUrl,
                });
                console.log('Successfully shared');
            } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to copy if share fails or is cancelled
                copyToClipboard(fullUrl);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard(fullUrl);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Optionally show an error message to the user
        });
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out"
            aria-label={copied ? "Link Copied" : "Share this listing"}
        >
            {copied ? (
                <>
                    <CheckIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Copied!
                </>
            ) : (
                <>
                    {navigator.share ? (
                        <ShareIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    ) : (
                        <ClipboardIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    )}
                    Share
                </>
            )}
        </button>
    );
} 