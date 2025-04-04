'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons

export function ShareButton() {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
    }, []);

    const handleShare = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const fullUrl = `${baseUrl}${pathname}`;

        if (canShare) {
            try {
                await navigator.share!({
                    title: document.title,
                    text: 'Check out this listing!',
                    url: fullUrl,
                });
                console.log('Successfully shared');
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
                copyToClipboard(fullUrl);
            }
        } else {
            copyToClipboard(fullUrl);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors duration-150 ease-in-out"
            aria-label={copied ? "Link Copied" : "Share this listing"}
        >
            {copied ? (
                <>
                    <CheckIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                    Copied!
                </>
            ) : (
                <>
                    {canShare ? (
                        <ShareIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                    ) : (
                        <ClipboardIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                    )}
                    Share
                </>
            )}
        </button>
    );
} 